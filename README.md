<!--[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![CI](https://github.com/xolvio/typescript-event-sourcing/workflows/CI/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/640342f38bcd97af7301/maintainability)](https://codeclimate.com/repos/5ebc9a4f49e99a0178002bcd/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/640342f38bcd97af7301/test_coverage)](https://codeclimate.com/repos/5ebc9a4f49e99a0178002bcd/test_coverage)-->

# DDD, ES & CQRS w/ TS
## _Domain Driven Design, Event Sourcing & Command Query Responsibility Segregation with Typescript_ 

A reference repository that aims to reduce the learning curve for people trying to learn the above.

## About

ES/CQRS is an architecture that separates the read and write models and uses events as the data store as opposed to a typical structured database.

This approach allows you to build read models to cover use-cases as you need them, since you use events as the source of truth and not the latest snapshot of data. 

This means information is not lost and you are able to go back and forth in time to retroactively answer *business* questions. 

It is impossible to foresee future requirements and a structured data storage approach only answers today's requirements. An event-based storage approach allows you to replay those events.

This is an incredible power and it is the *business* reason to do ES/CQRS. Here are some potential benefits:

* Replay the events and create reports such as: "How many items do people add and remove from their cart before checking out?" and "How many invites do users send before a team becomes active?"
* Quickly create new views of the same data for different business units 
* Distributed development where domain experts work on the domain side, and database experts work on the views side
* Cheaper integration with other systems. Integration is built-in since external systems only have to subscribe to events. Integration is one of the biggest costs in enterprise software projects. 

You don't do ES/CQRS because it's sexy (even though it is!), you do it because it is an architecture that provides more business value over the long-term than the alternatives.

However, ES/CQRS can be a little intimidating to get started with and the learning curve is a little on the steep side. This is the reason this repository exists, to make that learning curve a little less steep.


## The Architecture
Here's a little discussion on the differences between ES/CQRS and other architectures.

### Non ES/CQRS Architectures 
A good majority of software architectures deal with a centralized store for state such as a database. Requests from clients set and retrieve state from the centralized store and the state is kept up to date. Here the read and write models and combined into that centralized store.

The flow may look something like this in a synchronous model:
```
Make request (Client) > Execute business logic (Service) > Write to the database (Repository) > Give response to the user (Service)
```

Or like this in an asynchronous model:
```
Make write request (Client) > Queue request (Controller) > Return ack/nack to user (Controller)

Read queue (Process) > Execute business logic (Service) > Write the database (Repository)

Make read request (Client) > Execute read logic (Service) > Get values from database (Repository)
```
_Note that the request and response are separate in the above example but the data read/write to the database are unified._

### ES/CQRS
This architecture separates the write model from the read model such that the data stores are different for each side, which is necessarily asynchronous.

Here's the flow for the read and write models:

Write Model
```
Send Command (Client) > Handle Command (Command Handlers) > Execute business logic (Aggregate) > Raise events/exceptions (Aggregate) > Store events (Event Store) > Publish Event (Publisher)
```

Read Model
```
Subscribe to Events (Projection) > Build a read model as events come in (Projection) > persist in some data store (Projection)
```
_Note that you can also replay events from specific start/end times and subscribe to those, in this case the read model is on-demand as opposed to continuous_


### Eventual Consistency

[As per CAP theorem](https://en.wikipedia.org/wiki/CAP_theorem), it is impossible for a distributed data store to simultaneously provide more than two out of the following three guarantees:

* Consistency: Every read receives the most recent write or an error
* Availability: Every request receives a (non-error) response, without the guarantee that it contains the most recent write
* Partition tolerance: The system continues to operate despite an arbitrary number of messages being dropped (or delayed) by the network between nodes

Different data store approaches optimize for different axioms.
 
You might consider that non ES/CQRS architectures are consistent, but in reality they are not. They are also eventually consistent. A request may come in to change state while another request comes in to read that same state. There is a probability that a user may get out of date information. However, because the processing and locking of databases happens so quickly, it minimizes the window in which this can eventual consistency happens.   
   
Event sourcing embraces the eventual consistency axiom and optimizes for availability and partition tolerance. This means conversations have to be had on a case-by-case basis for how to handle the up-to-dateness of information. For example, if the data on a report is 10m late this may be a non-issue and doesn't require any additional work, however requiring unique users may be a must-have, in which case you may need to have some sort of index that validates new user requests prior to writing events.   

## Sam's Rough Learning Notes
As I watched videos, read articles, and parsed code, I wrote down as much of my learning journey as I could, at the same time as writing the code for this repository. I've retrospectively tried to structure the notes a little. I hope you find these useful!

#### Command > Domain Interaction
1. The command is responsible for loading the aggregate root from the repo (if needed)
1. the repo gets the aggregate root and replays all the events on it
1. The command acts on the aggregate root
1. The aggregate root does not mutate state at all. It validates then it performs an "applyChange" with the event in past tense
1. the aggregate root puts the event(s) in an "uncommittedEvents" list inside the aggregate root
1. The command tells the repository to save the aggregate root
1. the repository will save all the uncommitted events on a domain model

#### Read Model Projection
- subscribes to events and builds a view out of them continuously. This is different to snapshots

#### Snapshots
- used for replay performance and not projections (though they would help here too)
- only consider after ~1,000 events

#### Event Stores
- every event for an aggregate increments by one for every event added
- the event store throws a concurrency exception when the event version does not match the aggregate expected version
- event stores are not trivial to implement and it's good to use a framework here

## Notes on commands:
- they help debug issues if they are stored
- they help with intelligence about user actions
- they can be used to run the ultimate smoke test: Run all production commands on the new system and expect the logs to be the same for the unchanged parts.

## On uniqueness:
- https://groups.google.com/d/msg/dddcqrs/aUltOB2a-3Y/0p0PQVNFONQJ
- An elegant solution is to use a hash of the object as the aggregate id, which makes it easy to find an existing aggregate in the store.

# Notes from [watching Greg's 6h video](https://www.youtube.com/watch?v=whCk1Q87_ZI)
- Commands are always in the imperative tense. Events always in the past tense
- CQRS means creating one object with all the commands on it, and another with all the queries on it
- Allows you to version your commands separately from your queries, and allows you to deploy them to different places also
- Queries are basically the read model it projections. They don't need a DB to scale. They need functions and that cheaper to scale. It's a functional database
- The reason to have a command message vs a command handler, is that the handler can have DI like repos injected into it and the message portion can remain simple
- Never hold logic in your command handler. Logic belongs in the domain only
- Never handle transactions in a command. Instead create a TransactionHandler that can call a sequence of commands. See 1:14:00 in video. You can create a transactional handler that chains logging in top of the actual command
- This is the pattern for doing cross cutting concerns like logging. Could be seen as a pipeline - Chain of responsibility - Can wrap in a unit of work
- Command handlers are always a 1:1 mapping from incoming commands. A hashtable is sufficient
- Can use annotations I think for for the chain of command
- It's important to have 2 separate classes for commands and events even though they are typically identical bar the tense. It makes the language make sense.
- You can reject a command but you can't reject an event as you are not part of that transaction. When you reason about this through language, the differentiation in the classes makes it easier to express as language
- For example, may also have some bad events that need to be corrected with a command. When you try to read these back with a mixed tense, it becomes difficult
- You typically don't raise events for failures, since domains are state transitions and a failure means no state transitions should have happened. Better to log these at the command level. And actually keep all logging at the command handler level using chain of command
- May also want to keep logging out of the transaction since io creates latency
- There are huge benefit to using ES from a business perspective. Like I may want to know: it seems that when people invite someone after they've written 2 specs they are more likely to stick around in the app. Because we don't lose any information, we can test that theory and come up with business intelligence. This cant be done retrospectively with a structural data approach.
- Commands have behaviors. You don't replay them. Eg. You don't want to bill someone's credit card twice
- You can change your domain model independently of the structural model
- When you have a bug, you can relay all the events up to that bug, and that becomes your unit test "setup" portion
- Integration model is built in from the start. It's a push model. Anyone interested in integration simply subscribes to the events
- Research task based ui's
- Start with adding events, this will already give you massive reporting value
- Then separate your read model. This enables you to have lots of read models (different structural models for different needs) (edited)
- Publish and send for the bus
- Research sagas

## Useful Links:
* CQRS FAQ - http://cqrs.nu/Faq - (seems to be offline, but [here's the cached version](https://webcache.googleusercontent.com/search?q=cache:http://cqrs.nu/Faq&strip=1&vwsrc=0))
* Greg Young Simple CQRS repo (.Net) - https://github.com/gregoryyoung/m-r/tree/master/SimpleCQRS
* Node Aggregate Example - https://github.com/jamuhl/nodeCQRS/blob/master/domain/app/itemAggregate.js
* Greg Young's simple CQRS example written using Node.js - https://github.com/JanVanRyswyck/node-m-r
* DDD/CQRS Forums - https://groups.google.com/forum/#!forum/dddcqrs
* CQRS Documents by Greg Young - https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf
* GregYoung 8 CQRS Class - https://www.youtube.com/watch?v=whCk1Q87_ZI
* Rough Notes about CQRS and ES - https://gist.github.com/jaceklaskowski/d267bf4176822293e95e
* Greg Young - CQRS and Event Sourcing - Code on the Beach 2014 - https://www.youtube.com/watch?v=JHGkaShoyNs
