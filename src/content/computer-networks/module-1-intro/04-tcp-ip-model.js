export default {
  id: 'cn-1-4-tcp-ip-model',
  number: '04',
  title: 'The TCP/IP Model & Comparative Analysis (OSI vs TCP/IP)',
  syllabusMapping: 'Network Models: TCP/IP Model',
  summary: 'Architecture of the Department of Defense (DoD) TCP/IP protocol suite, layer responsibilities, protocol mapping, and comparison against the OSI reference model.',
  
  examWeightage: {
    marks: '5 to 10 Marks',
    frequency: 'Very frequently asked in Mumbai University (Compare and contrast OSI and TCP/IP model with neat sketches)',
    expectedQuestions: [
      'Explain the TCP/IP Reference Model with neat architecture diagram and protocols at each layer.',
      'Differentiate between the OSI Model and the TCP/IP Model across at least six technical parameters.',
      'Why is the OSI model called a reference model while TCP/IP is an implementation model?'
    ]
  },

  theory: `
### 1. Introduction to the TCP/IP Model
Designed by the **Defense Advanced Research Projects Agency (DARPA)** in the 1970s for ARPANET, the **TCP/IP protocol suite** is the practical foundation of the modern global Internet. Unlike the theoretical OSI model, TCP/IP was engineered around actual working protocols.

---

### 2. Layers of the TCP/IP Protocol Suite

\`\`\`
[ Layer 4 ] Application Layer       -> HTTP, HTTPS, FTP, SMTP, DNS, SSH, DHCP
[ Layer 3 ] Transport Layer         -> TCP (Reliable), UDP (Fast / Datagram)
[ Layer 2 ] Internet Layer          -> IP (IPv4/IPv6), ICMP, IGMP, ARP, RARP
[ Layer 1 ] Network Access (Link)   -> Ethernet (802.3), Wi-Fi (802.11), PPP
\`\`\`

#### Layer 1: Network Access (Host-to-Network) Layer
* Combines the functions of OSI Physical and Data Link layers.
* Governs hardware addressing (MAC), physical signaling, and driver interfaces to transmit frames over the physical link (Ethernet cables, optical fiber, wireless RF).

#### Layer 2: Internet Layer
* Directly corresponds to the OSI Network Layer.
* Responsible for routing packets (datagrams) across heterogeneous networks using **Internet Protocol (IP)**.
* **Core Protocols**:
  * **IP (IPv4/IPv6)**: Unreliable, best-effort connectionless packet routing.
  * **ICMP (Internet Control Message Protocol)**: Diagnostic error reporting (used by \`ping\` and \`traceroute\`).
  * **ARP (Address Resolution Protocol)**: Maps a known 32-bit logical IP address to a 48-bit physical MAC address.
  * **IGMP (Internet Group Management Protocol)**: Coordinates IP multicasting.

#### Layer 3: Transport Layer
* Corresponds directly to the OSI Transport Layer.
* Establishes end-to-end communication channels between applications on different hosts.
* **Core Protocols**:
  * **TCP (Transmission Control Protocol)**: Connection-oriented, reliable, guaranteed in-order delivery, byte-stream, with flow control and congestion control.
  * **UDP (User Datagram Protocol)**: Connectionless, unreliable, lightweight datagram protocol with minimal overhead (ideal for DNS, VoIP, streaming).

#### Layer 4: Application Layer
* Consolidates OSI Layers 5, 6, and 7 (Session, Presentation, and Application).
* Contains all high-level application protocols: HTTP/HTTPS (Web), SMTP/POP3/IMAP (Email), FTP (File transfers), DNS (Domain name resolution), DHCP (Dynamic IP assignment).

---

### 3. Detailed Comparison: OSI vs TCP/IP Model

| Comparison Parameter | OSI Reference Model | TCP/IP Protocol Suite |
| :--- | :--- | :--- |
| **Number of Layers** | **7 Layers** (Physical, DLL, Network, Transport, Session, Presentation, Application) | **4 Layers** (Network Access, Internet, Transport, Application) |
| **Origin & Nature** | Developed by **ISO** in 1984 as a theoretical, conceptual standard framework. | Developed by **DoD/DARPA** in the 1970s; an implementation standard based on existing protocols. |
| **Approach** | Top-down, strict architectural protocol independence. Model was developed before protocols. | Protocols were designed first; the model is simply a description of the protocols. |
| **Session & Presentation** | Has distinct Session (Layer 5) and Presentation (Layer 6) layers. | No separate Session or Presentation layers; handled within Application layer. |
| **Network Layer Service** | Supports **both Connection-Oriented and Connectionless** communication. | Supports **only Connectionless** communication at the Internet layer (IP is strictly connectionless). |
| **Transport Layer Service** | Supports **only Connection-Oriented** communication. | Supports **both Connection-Oriented (TCP) and Connectionless (UDP)**. |
| **Protocol Dependency** | Protocol-independent; purely a reference guide. | Protocols are tightly coupled to the Internet architecture. |
| **Usage** | Rarely implemented in pure form; used for academic teaching and conceptual modeling. | Dominates the global telecommunications and Internet industry. |
  `,

  keyTakeaways: [
    'TCP/IP is a 4-layer suite: Network Access, Internet, Transport, Application.',
    'TCP/IP consolidates OSI Layers 5, 6, 7 into the Application layer.',
    'At Network/Internet layer: OSI supports both connectionless and connection-oriented; TCP/IP supports only connectionless (IP).',
    'At Transport layer: OSI is strictly connection-oriented; TCP/IP supports both TCP (connection-oriented) and UDP (connectionless).'
  ],

  quiz: [
    {
      id: 'q4-1',
      question: 'How many layers are defined in the canonical DoD DARPA TCP/IP Protocol Suite?',
      options: ['7 Layers', '5 Layers', '4 Layers', '6 Layers'],
      correctIndex: 2,
      explanation: 'The standard TCP/IP reference architecture consists of 4 layers: Network Interface / Access, Internet, Transport, and Application.'
    },
    {
      id: 'q4-2',
      question: 'At the Network / Internet layer, which paradigm does the TCP/IP model exclusively support?',
      options: [
        'Connection-Oriented only (Virtual Circuits)',
        'Connectionless only (IP datagrams)',
        'Both Connection-Oriented and Connectionless',
        'Direct circuit switching'
      ],
      correctIndex: 1,
      explanation: 'The Internet Protocol (IP) is purely connectionless; every packet is routed independently through routers on a best-effort basis.'
    },
    {
      id: 'q4-3',
      question: 'Which TCP/IP Transport layer protocol provides low-overhead, unacknowledged datagram delivery for real-time applications?',
      options: ['TCP', 'UDP', 'ICMP', 'BGP'],
      correctIndex: 1,
      explanation: 'UDP (User Datagram Protocol) avoids handshake roundtrips and acknowledgments, providing fast streaming for DNS, VoIP, and gaming.'
    },
    {
      id: 'q4-4',
      question: 'Why is the TCP/IP architecture often visualized as an "Hourglass" shape?',
      options: [
        'Because data flows in both directions simultaneously',
        'Because it features a single unifying waist protocol (IP) supporting many underlying hardware media below and many diverse applications above',
        'Because TCP packets take twice as long to transmit as UDP packets',
        'Because the Session and Presentation layers act as time filters'
      ],
      correctIndex: 1,
      explanation: 'IP serves as the narrow central "waist" connecting diverse underlying access technologies (Ethernet, Wi-Fi, Fiber) with multiple application protocols (HTTP, SMTP, DNS).'
    },
    {
      id: 'q4-5',
      question: 'Which three OSI layers are consolidated into the single Application layer in TCP/IP?',
      options: [
        'Transport, Network, and Data Link',
        'Session, Presentation, and Application',
        'Physical, Data Link, and Network',
        'Presentation, Transport, and Network'
      ],
      correctIndex: 1,
      explanation: 'TCP/IP leaves session management, data encryption/compression, and application logic directly to application software developers.'
    },
    {
      id: 'q4-6',
      question: 'What is the primary role of ICMP (Internet Control Message Protocol) in the TCP/IP suite?',
      options: [
        'Encrypting user passwords during login',
        'Reporting router errors, unreachable destinations, and TTL expiration (used by ping & traceroute)',
        'Resolving 32-bit IP addresses to 48-bit MAC addresses',
        'Assigning dynamic IP addresses to new clients'
      ],
      correctIndex: 1,
      explanation: 'ICMP runs as a network-layer companion to IP, returning diagnostic messages like "Destination Unreachable" and "Time to Live Exceeded".'
    },
    {
      id: 'q4-7',
      question: 'How does TCP guarantee reliable data delivery across an inherently unreliable IP network?',
      options: [
        'By hardcoding hardware links between sender and receiver',
        'Using 3-way handshakes, sequence numbers, cumulative acknowledgments, and timeout retransmissions',
        'By dropping corrupted packets silently without telling the sender',
        'By forcing all packets to travel along a single optical fiber'
      ],
      correctIndex: 1,
      explanation: 'TCP tracks sequence numbers, checks CRC integrity, calculates adaptive retransmission timers, and uses sliding window flow control.'
    }
  ]
};

