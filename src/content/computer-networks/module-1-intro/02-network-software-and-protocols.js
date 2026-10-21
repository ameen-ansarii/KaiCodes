export default {
  id: 'cn-1-2-network-software-and-protocols',
  number: '02',
  title: 'Network Software, Protocol Hierarchies & Layer Design Issues',
  syllabusMapping: 'Networks Software, Protocol, Design issues for the Network layers',
  summary: 'Architectural concepts of layered network software, protocols, service interfaces, and the core engineering design issues across protocol layers.',
  
  examWeightage: {
    marks: '5 to 10 Marks',
    frequency: 'Asked frequently in MU End-Semester exams (Direct theory question on Design Issues or Protocol Elements)',
    expectedQuestions: [
      'Define a Protocol. Explain its three key elements: Syntax, Semantics, and Timing.',
      'Explain the concept of Protocol Hierarchies, Services, and Interfaces.',
      'What are the key design issues for the network layers? Explain at least five in detail.'
    ]
  },

  theory: `
### 1. What is Network Software?
To reduce design complexity, modern computer networks are organized as a **stack of layers** or levels, each built upon the one below it. Network software consists of the protocols, device drivers, and socket libraries that coordinate communication between these layers across physical hardware.

---

### 2. Definition & Key Elements of a Protocol
A **Protocol** is a formal set of rules and conventions that govern how two peer entities in a network communicate, exchange data packets, and handle exceptions.

A protocol is defined by three fundamental components:
1. **Syntax**: Refers to the structure, format, and layout of the data packet (e.g., first 4 bits indicate IP version, next 4 bits indicate header length).
2. **Semantics**: Refers to the meaning of each section of bits. How should a specific bit pattern be interpreted, and what action must be taken (e.g., whether an address identifies a router or a destination host, or whether a flag signals SYN or FIN)?
3. **Timing**: Refers to synchronization—when data should be sent, how fast it can be transmitted, and sequencing to prevent race conditions or buffer overflow.

---

### 3. Protocol Hierarchies, Services & Interfaces

* **Layer $n$**: Provides services to Layer $n+1$ and uses services provided by Layer $n-1$.
* **Peer Entities**: Entities (software processes or hardware modules) running on different machines at the exact same layer. Peer entities communicate using the **Layer $n$ Protocol**.
* **Interface (SAP - Service Access Point)**: The boundary between adjacent layers defining which primitive operations and services the lower layer offers to the upper layer.
* **Network Architecture**: The set of layers and protocols that define a network system.
* **Protocol Stack**: The specific list of protocols used by a system, one protocol per layer.

---

### 4. Key Design Issues for Network Layers
Every layer in a network architecture must address specific engineering challenges:

#### A. Addressing & Identification
* Every node and process in a network must be uniquely identifiable.
* Mechanisms are needed to identify the sending host, receiving host, and the specific application process (e.g., IP addresses at Network Layer, Port numbers at Transport Layer).

#### B. Error Control (Detection & Correction)
* Physical communication channels are inherently imperfect and introduce bit flips, noise, and frame loss.
* Protocols must incorporate error detection codes (Parity, Checksum, CRC) and error correction (Hamming code, Automatic Repeat reQuest - ARQ).

#### C. Flow Control
* Prevents a fast-transmitting sender from overwhelming and crashing a slower receiving computer with limited buffer capacity.
* Handled through feedback mechanisms such as Stop-and-Wait and Sliding Window protocols.

#### D. Multiplexing & Demultiplexing
* Combining multiple independent logical data streams over a single shared physical transmission channel (Multiplexing) and separating them at the destination (Demultiplexing).
* Handled using time-division (TDM), frequency-division (FDM), or port-number bindings.

#### E. Routing & Switching
* When multiple paths exist between source and destination, the network layer must dynamically determine the most efficient and shortest route avoiding congestion and link failures.

#### F. Quality of Service (QoS) & Congestion Management
* Providing guarantees on minimum bandwidth, maximum delay (latency), and jitter for real-time video/voice traffic vs asynchronous file transfers.

#### G. Security & Confidentiality
* Protecting data in transit against unauthorized eavesdropping (Encryption), tampering (Integrity hashing), and spoofing (Authentication).

---

### 5. Connection-Oriented vs Connectionless Service

Layers can offer two distinct types of service to the layer above them:

| Comparison Factor | Connection-Oriented Service | Connectionless Service |
| :--- | :--- | :--- |
| **Analogy** | **Telephone System** (Must dial, wait for pickup, talk, and hang up) | **Postal Letter System** (Drop addressed envelope into mailbox without prior notice) |
| **Phases** | 3 distinct phases: **Connection Establishment**, **Data Transfer**, and **Connection Release / Teardown**. | Only 1 phase: **Data Transfer** directly. No setup or teardown. |
| **Path & Ordering** | Packets follow the same logical circuit; guaranteed in-order arrival. | Each packet (datagram) is routed independently; may arrive out-of-order or via different paths. |
| **Header Overhead** | Minimal per packet once connection is established (connection identifier used). | High overhead: every single datagram must contain the full destination address. |
| **Reliability** | Usually reliable with acknowledgments (ACK) and retransmissions. | Unreliable / Best-effort by default; packets may be lost without sender notification. |
| **Protocol Examples** | TCP (Transmission Control Protocol), ATM, Frame Relay. | UDP (User Datagram Protocol), IPv4, IPv6, ICMP. |

---

### 6. Interfaces, Services & Service Primitives

#### Distinction between Services and Protocols
* **Service**: A set of operations and primitives that a layer provides to the layer *above* it. A service defines what operations the layer is prepared to perform, but says nothing about how those operations are implemented. It relates to the interface between adjacent layers on the **same machine**.
* **Protocol**: A set of rules governing the format and meaning of the packets/frames exchanged by peer entities on **different machines**. Entities use protocols to implement their service definitions.

#### Service Primitives
A service is formally specified by a set of **primitives** (system call operations) available to an application or higher layer process to access the service:
1. **LISTEN**: Block and wait for an incoming connection request.
2. **CONNECT**: Establish a connection with a waiting peer entity.
3. **RECEIVE**: Block waiting for incoming data.
4. **SEND**: Transmit information to the connected peer.
5. **DISCONNECT**: Terminate the established connection.

#### Four Classes of Service Primitives:
* **Request**: An entity wants the service to do some work (e.g., higher layer calls lower layer).
* **Indication**: An entity is informed about an event (e.g., lower layer notifies higher layer).
* **Response**: An entity wants to react to an event.
* **Confirm**: The acknowledgement that a requested action has completed.
  `,

  keyTakeaways: [
    'Protocols comprise Syntax (format), Semantics (meaning), and Timing (speed & sequence).',
    'A Service defines what a layer provides to the layer above it; a Protocol defines how peer entities on different machines communicate to fulfill that service.',
    'Connection-Oriented service uses 3 phases (Setup, Transfer, Teardown) like a telephone call; Connectionless service delivers independent datagrams like postal letters.',
    'Core design challenges across layers: Addressing, Error Control, Flow Control, Multiplexing, Routing, and Security.'
  ],

  quiz: [
    {
      id: 'q2-1',
      question: 'Which key component of a network protocol dictates the data format, coding schemes, and bit-level field structures?',
      options: ['Timing', 'Semantics', 'Syntax', 'Service Primitive'],
      correctIndex: 2,
      explanation: 'Syntax defines how data is formatted and structured into bit fields, Semantics specifies the meaning of each section, and Timing governs transmission speed and sequencing.'
    },
    {
      id: 'q2-2',
      question: 'Which sequence correctly represents the three operational phases of a Connection-Oriented Service?',
      options: [
        'Addressing ➔ Routing ➔ Switching',
        'Connection Establishment ➔ Data Transfer ➔ Connection Release',
        'Frame Assembly ➔ Transmission ➔ Checksum Verification',
        'Request ➔ Indication ➔ Confirm'
      ],
      correctIndex: 1,
      explanation: 'Analogous to a telephone call, Connection-Oriented services require setup, reliable ordered payload transfer, and formal teardown.'
    },
    {
      id: 'q2-3',
      question: 'What is the architectural distinction between a "Service" and a "Protocol"?',
      options: [
        'A service is between remote machines; a protocol is between local layers',
        'A service defines what operations a layer offers to the layer above it locally; a protocol defines how peer entities across hosts communicate',
        'Services run exclusively in hardware while protocols are purely operating system code',
        'They are technically synonymous in ISO terminology'
      ],
      correctIndex: 1,
      explanation: 'Services define the vertical interface between adjacent layers on the same machine. Protocols define horizontal message formats between peer layers over the network.'
    },
    {
      id: 'q2-4',
      question: 'Which Service Primitive is issued by the lower-layer service provider to inform a higher-layer entity of an incoming connection or event?',
      options: ['REQUEST', 'INDICATION', 'RESPONSE', 'CONFIRM'],
      correctIndex: 1,
      explanation: 'INDICATION notifies an entity that an event has occurred (such as an incoming connection request or arrival of new data).'
    },
    {
      id: 'q2-5',
      question: 'Why do datagram packets in a connectionless service suffer higher header overhead than connection-oriented packets?',
      options: [
        'They must carry full source and destination IP/MAC addresses on every individual packet',
        'They encrypt payload data twice',
        'They contain mandatory video sync frames',
        'They repeat connection setup handshakes on every hop'
      ],
      correctIndex: 0,
      explanation: 'Since each datagram is routed independently without a pre-established virtual circuit, every single packet must contain full addressing metadata.'
    },
    {
      id: 'q2-6',
      question: 'Which protocol design issue specifically deals with preventing a high-speed transmitting host from swamping a slow receiving host?',
      options: ['Routing', 'Addressing', 'Flow Control', 'Multiplexing'],
      correctIndex: 2,
      explanation: 'Flow Control manages transmission rate between sender and receiver (e.g., sliding window, feedback buffers) so the receiver buffer is not overrun.'
    },
    {
      id: 'q2-7',
      question: 'In peer-to-peer layered protocol hierarchies, what is the data unit called after header encapsulation at the Transport Layer?',
      options: ['Frame', 'Packet / Datagram', 'Segment', 'Physical Bitstream'],
      correctIndex: 2,
      explanation: 'Data units are called Segments at Layer 4 (Transport), Packets/Datagrams at Layer 3 (Network), Frames at Layer 2 (Data Link), and Bits at Layer 1.'
    }
  ]
};

