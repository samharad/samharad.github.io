---
layout: post
title: Advent of Code 2021 Day 01
draft: true
---
# This is a large heading!
```clojure
(ns aoc.2021.day.01
  (:require [hyperfiddle.rcf :as rcf]))
(rcf/enable!)
```

### This is a smaller heading!

This is plain text (in markdown).
```clojure
; This code-comment documents the code beneath it
(defn foo [] "Hello World!")
(rcf/tests
  (foo) := "Hello World!")
```
