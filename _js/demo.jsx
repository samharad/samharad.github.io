import { h, render } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

// Timing constants (in milliseconds)
const SAVE_TO_CACHE_DELAY = 1000;
const FLUSH_TO_DISK_DELAY = 1700;
const FLUSH_DURATION = 1000;
const SAVED_MESSAGE_DURATION = 2000;

function Demo({ fsyncMode = false }) {
  const [state, setState] = useState({
    favColor: 'blue',
    cachedFavColor: 'blue',
    diskFavColor: 'blue',
    showSaved: false,
    showReversion: false,
    savingColor: null,
    flushingColor: null,
    fsyncEnabled: false
  });
  const isInitialMount = useRef(true);

  const handleUnplug = () => {
    // Simulate instance restart - restore from disk, losing cache
    setState(prev => {
      // Detect reversion: user saw "Saved!" but data wasn't on disk (only when fsync is disabled)
      const isReversion = !prev.fsyncEnabled && prev.favColor !== prev.diskFavColor && prev.showSaved;
      return {
        ...prev,
        favColor: prev.diskFavColor,
        cachedFavColor: prev.diskFavColor,
        showSaved: false,
        showReversion: isReversion,
        savingColor: null,
        flushingColor: null
      };
    });
  };

  useEffect(() => {
    if (state.showSaved) {
      const timer = setTimeout(() => {
        setState(prev => ({...prev, showSaved: false}));
      }, SAVED_MESSAGE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [state.showSaved]);

  useEffect(() => {
    if (state.showReversion) {
      const timer = setTimeout(() => {
        setState(prev => ({...prev, showReversion: false}));
      }, SAVED_MESSAGE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [state.showReversion]);

  // Show "Saved!" when fsync is enabled and color is flushed to disk
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Only show "Saved!" when diskFavColor changes to match favColor (actual save completion)
    // Don't show it just because fsyncEnabled changed or on initial mount
    if (state.fsyncEnabled && state.diskFavColor === state.favColor && state.flushingColor === null && state.savingColor === null && !state.showSaved) {
      setState(prev => ({...prev, showSaved: true}));
    }
  }, [state.diskFavColor]);

  // Handle saving to cache (1 second operation)
  useEffect(() => {
    if (state.favColor !== state.cachedFavColor) {
      const colorToSave = state.favColor;
      setState(prev => ({...prev, savingColor: colorToSave}));

      const saveTimer = setTimeout(() => {
        setState(prev => {
          // Only update if we're still saving this color
          if (prev.savingColor === colorToSave) {
            return {
              ...prev,
              cachedFavColor: colorToSave,
              savingColor: null,
              showSaved: true
            };
          }
          return prev;
        });
      }, SAVE_TO_CACHE_DELAY);

      return () => clearTimeout(saveTimer);
    }
  }, [state.favColor, state.cachedFavColor]);

  // Handle flushing to disk
  useEffect(() => {
    if (state.cachedFavColor !== state.diskFavColor && state.flushingColor === null) {
      const colorToFlush = state.cachedFavColor;
      const flushDelay = state.fsyncEnabled ? 0 : FLUSH_TO_DISK_DELAY;

      // Schedule flush
      const flushTimer = setTimeout(() => {
        // Start flushing
        setState(prev => ({...prev, flushingColor: colorToFlush}));

        // Complete flush after 1 second
        setTimeout(() => {
          setState(prev => {
            // Only update if we're still flushing this color
            if (prev.flushingColor === colorToFlush) {
              return {
                ...prev,
                diskFavColor: colorToFlush,
                flushingColor: null
              };
            }
            return prev;
          });
        }, FLUSH_DURATION);
      }, flushDelay);

      return () => clearTimeout(flushTimer);
    }
  }, [state.cachedFavColor, state.diskFavColor, state.fsyncEnabled]);

  function FavoriteColorSelector() {
    // In fsync mode, show spinner until favColor reaches disk
    const isWaitingForDisk = state.fsyncEnabled && state.diskFavColor !== state.favColor;
    // In non-fsync mode, show spinner while saving to cache
    const isShowingSpinner = state.fsyncEnabled ? isWaitingForDisk : state.savingColor !== null;
    const shouldShowSaved = state.fsyncEnabled ? (state.diskFavColor === state.favColor && state.showSaved) : state.showSaved;

    return <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
      🧑 (User) My favorite color is:
      {isShowingSpinner ? (
        <span style={{
          opacity: 1,
          transition: 'opacity 0.3s ease-in-out',
          display: 'inline-block',
          width: '16px',
          height: '16px',
          border: '2px solid #f3f3f3',
          borderTop: '2px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginLeft: '8px'
        }}></span>
      ) : (
        <select
          value={state.favColor}
          onChange={(e) => setState(prevState => ({...prevState, favColor: e.target.value}))}
          style={{
            marginLeft: '8px',
            padding: '4px',
            color: state.favColor
          }}
        >
          <option value="blue">blue</option>
          <option value="red">red</option>
          <option value="green">green</option>
          <option value="purple">purple</option>
          <option value="orange">orange</option>
        </select>
      )}
      {!isShowingSpinner && (
        <>
          <span style={{
            opacity: shouldShowSaved ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            fontWeight: 'bold'
          }}>
            Saved!
          </span>
          <span style={{
            opacity: state.showReversion ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            fontWeight: 'bold',
            color: '#e74c3c'
          }}>
            Reversion!
          </span>
        </>
      )}
    </div>;
  }

  function CachedColorDisplay() {
    return <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
      <div>
        🤖 (Cache) User's favorite color is: <span style={{color: state.cachedFavColor}}>{state.cachedFavColor}</span>
      </div>
      {state.flushingColor !== null && (
        <span style={{
          opacity: state.flushingColor ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          fontWeight: 'bold'
        }}>
          Flushing...
        </span>
      )}
    </div>;
  }

  function DiskColorDisplay() {
    return <div>
      💾 (Disk) User's favorite color is: <span style={{color: state.diskFavColor}}>{state.diskFavColor}</span>
    </div>;
  }

// Renders a dropdown for favorite color selection
  return (
    <div style={{border: '2px solid #ddd', padding: '20px', borderRadius: '8px', margin: '20px 0'}}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          {FavoriteColorSelector()}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <button
            onClick={handleUnplug}
            style={{
              padding: '6px 12px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            🔌 Unplug!
          </button>
          {fsyncMode && (
            <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: state.diskFavColor !== state.favColor ? 'not-allowed' : 'pointer'}}>
              <span
                style={{opacity: state.diskFavColor !== state.favColor ? 0.5 : 1, fontFamily: 'monospace'}}>fsync</span>
              <div style={{
                position: 'relative',
                width: '44px',
                height: '24px',
                backgroundColor: state.fsyncEnabled ? '#3498db' : '#ccc',
                borderRadius: '12px',
                transition: 'background-color 0.3s',
                opacity: state.diskFavColor !== state.favColor ? 0.5 : 1,
                pointerEvents: state.diskFavColor !== state.favColor ? 'none' : 'auto'
              }}
              onClick={() => {
                if (state.diskFavColor === state.favColor) {
                  setState(prev => ({...prev, fsyncEnabled: !prev.fsyncEnabled}));
                }
              }}>
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: state.fsyncEnabled ? '22px' : '2px',
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: 'left 0.3s'
                }}></div>
              </div>
            </label>
          )}
        </div>
      </div>
      <br/>
      {CachedColorDisplay()}
      <br/>
      {DiskColorDisplay()}
    </div>
  );
}

// Mount the component when the DOM is ready
if (typeof window !== 'undefined') {
  const container = document.getElementById('demo-app');
  if (container) {
    render(<Demo />, container);
  }

  const fsyncContainer = document.getElementById('demo-fsync-app');
  if (fsyncContainer) {
    render(<Demo fsyncMode={true} />, fsyncContainer);
  }
}
