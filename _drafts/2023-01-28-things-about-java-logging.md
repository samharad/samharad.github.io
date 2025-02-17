---
layout: post
title: "Things to know about application logging in java"
---

Goals:
- remove any magic around calls to `logger.error("we're fudged!")`.
- survey logging libraries for Java and Clojure
- identify some logging best practices
- understand the relationship between my application's logging and my dependency libraries' logging

## What's going on with logging in Java?

First, a quick history of theJava logging ecosystem:

#### 2001: Log4j

The first major logging facility for Java.

[Selling points](https://logging.apache.org/log4j/1.2/):
- log levels configurable via config file
- minimal performance hit for inactive log statements
- fine-grained control of what's logged via Logger hierarchy
- support for different output targets

#### 2002: `java.util.logging` ("JUL")

"Java 2 SE 1.4" introduced a logging library to the standard library.

Public opinion says it's just bad enough to warrant disuse; notable shortcomings / oddities:

- slow string parameterization ([10x slower than alternatives, maybe](https://stackoverflow.com/questions/11359187/why-not-use-java-util-logging))
- thread name unavailable in log pattern (by default)
- not configurable via resource file (by default)
- [unusual log levels](https://docs.oracle.com/javase/8/docs/api/java/util/logging/Level.html)

#### 2006: SLF4J

"Simple Logging Facade", where "facade" hearkens back to GoF:

> Facade is a structural design pattern that provides a simplified interface to a library, a framework, or any other complex set of classes. - https://refactoring.guru/design-patterns/facade

The idea here is that end-users should choose their tool of choice for logging, and all of the Java code in the application and its dependencies should cooperate.

To accomplish that, Java libraries and applications are coded to the SLF4J interface, and the user brings his/her own implementation (or "provider", "binding") at deployment time.

Ships with implementations for JUL, log4j, and others.

As a library developer, it's essential to ensure that you ship without declaring a dependency, transitive or otherwise, on an implementation, because this would defeat the purpose.

If you depend on a library which uses JUL, log4j etc. directly, there are "bridging modules" available which will magically pipe those logs through the SLF4J interface.

Utopic!

#### 2006: Logback
#### 2014: Log4j2
#### System.Logger
#### Apache Commons Logging (JCL)

## Questions
- In what way are these log libs "frameworks"? In what way are they "facades"?
- What's the history of the java logging landscape?
- If my application is a framework, does it matter whether I use SLF4J?
- What to make of "fluent" slf4j

## Links
- Great SO post about why not JUL, which concludes: not JUL. https://stackoverflow.com/questions/11359187/why-not-use-java-util-logging
- 
