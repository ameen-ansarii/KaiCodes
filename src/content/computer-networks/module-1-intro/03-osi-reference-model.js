export default {
  id: 'cn-1-3-osi-reference-model',
  number: '03',
  title: 'The OSI 7-Layer Reference Model (ISO/IEC 7498-1)',
  syllabusMapping: 'Network Models: The OSI Reference Model',
  summary: 'In-depth architectural analysis of the Open Systems Interconnection (OSI) 7-layer reference model, layer functions, Protocol Data Units (PDUs), and encapsulation.',
  
  examWeightage: {
    marks: '10 Marks',
    frequency: 'High-frequency question in Mumbai University examination (Compulsory Question 1 or Question 2/3 with block diagram)',
    expectedQuestions: [
      'Draw and explain the 7-layer ISO-OSI Reference Model. Detail the functions of each layer.',
      'Explain the concept of Data Encapsulation and Decapsulation across the OSI model.',
      'Differentiate between the responsibilities of the Data Link Layer and the Transport Layer.'
    ]
  },

  theory: `
### 1. Introduction to the OSI Model
Developed by the **International Organization for Standardization (ISO)** in 1984, the **Open Systems Interconnection (OSI)** model is a conceptual 7-layer framework that standardizes network communication functions regardless of the underlying hardware vendor or architecture.

---

### 2. The 7 Layers of the OSI Model (Bottom to Top)

\`\`\`
[ Layer 7 ] Application Layer   -> User interface, network services (HTTP, DNS, SMTP)
[ Layer 6 ] Presentation Layer  -> Data representation, encryption, compression (SSL, JPEG)
[ Layer 5 ] Session Layer       -> Dialog control, session synchronization (RPC, NetBIOS)
[ Layer 4 ] Transport Layer     -> End-to-end delivery, reliability, flow control (TCP, UDP)
[ Layer 3 ] Network Layer       -> Logical addressing (IP), routing across subnets (IPv4, IPv6)
[ Layer 2 ] Data Link Layer     -> Node-to-node hop delivery, framing, MAC (Ethernet, PPP)
[ Layer 1 ] Physical Layer      -> Unstructured raw bit stream transmission (Cables, Radio)
\`\`\`

---

### 3. Detailed Functions of Each Layer

#### Layer 1: Physical Layer (PDU: Bit)
* Transmits unstructured, raw bit streams over a physical transmission medium.
* **Key Functions**:
  * **Bit Synchronization**: Receiver clock sync with sender clock.
  * **Line Configuration**: Point-to-point or multipoint connections.
  * **Transmission Mode**: Simplex, Half-Duplex, or Full-Duplex.
  * **Physical Topologies & Encoding**: Defines pinouts, voltage levels (e.g., +5V for binary 1, -5V for 0), and cable specs (RJ45, Cat6, Fiber).

#### Layer 2: Data Link Layer (PDU: Frame)
* Responsible for reliable **node-to-node (hop-to-hop)** frame delivery across the immediate physical link.
* **Key Functions**:
  * **Framing**: Dividing network layer packet streams into manageable data frames with headers and trailers.
  * **Physical Addressing**: Adding 48-bit hardware MAC addresses (Source & Destination).
  * **Flow Control**: Restricting sender transmission rates to match receiver buffering.
  * **Error Control**: Appending Cyclic Redundancy Check (CRC) trailers to detect corrupted frames; retransmits lost frames.
  * **Access Control**: Coordinating shared media access via MAC protocols (CSMA/CD).

#### Layer 3: Network Layer (PDU: Packet)
* Responsible for **source-to-destination (host-to-host)** packet delivery across multiple interconnected networks.
* **Key Functions**:
  * **Logical Addressing**: Assigning universal IP addresses (IPv4: 32-bit, IPv6: 128-bit) that transcend local LANs.
  * **Routing**: Selecting the optimal route for packets using routing algorithms (Dijkstra, Bellman-Ford) and routing tables.
  * **Fragmentation & Reassembly**: Dividing large packets exceeding the Maximum Transmission Unit (MTU) of intermediary links.

#### Layer 4: Transport Layer (PDU: Segment / Datagram)
* Responsible for **process-to-process (end-to-end)** reliable communication between specific running software applications.
* **Key Functions**:
  * **Service Point (Port) Addressing**: Appends 16-bit port numbers (e.g., Port 80 for HTTP, 443 for HTTPS) to direct segments to the correct application process.
  * **Segmentation & Reassembly**: Divides application data into sequenced numbered segments.
  * **Connection Control**: Connection-oriented (TCP 3-way handshake) or connectionless (UDP).
  * **End-to-End Flow & Error Control**: Regulates data flow between sender and receiver processes and initiates end-to-end retransmission.

#### Layer 5: Session Layer (PDU: Data)
* Establishes, manages, and terminates communication sessions between applications.
* **Key Functions**:
  * **Dialog Control**: Keeps track of whose turn it is to transmit (Half-Duplex or Full-Duplex).
  * **Synchronization & Checkpointing**: Inserts checkpoints into long data streams so transfers can resume from the last checkpoint upon network interruption rather than starting from zero.

#### Layer 6: Presentation Layer (PDU: Data)
* Ensures that data is delivered in a syntax and format that the receiving system understands. Known as the **network translator**.
* **Key Functions**:
  * **Translation**: Encoding between heterogeneous character sets (e.g., ASCII to EBCDIC, UTF-8).
  * **Encryption / Decryption**: Securing data during transmission (e.g., TLS/SSL protocols).
  * **Compression**: Reducing the number of bits to be transmitted (e.g., JPEG, MPEG, gzip).

#### Layer 7: Application Layer (PDU: Data)
* Directly interacts with software applications to provide end-user network services.
* **Protocols**: HTTP/HTTPS (Web), SMTP/IMAP (Email), FTP (File Transfer), DNS (Name Resolution), DHCP (IP Configuration), and Telnet/SSH.

---

### 4. Data Encapsulation and Decapsulation
* **Encapsulation (Sender side)**: Data moves from Layer 7 down to Layer 1. Each layer prepends its own control header (and Layer 2 appends a trailer), wrapping the higher-layer payload.
* **Decapsulation (Receiver side)**: Data moves from Layer 1 up to Layer 7. Each layer strips its respective header, checks for errors, and hands the decapsulated payload up to the peer layer.
  `,

  keyTakeaways: [
    'OSI is a 7-layer reference model developed by ISO.',
    'PDU mapping: Physical = Bits, Data Link = Frames, Network = Packets, Transport = Segments, Upper layers = Data.',
    'Data Link Layer handles hop-to-hop MAC delivery; Transport Layer handles end-to-end Port-to-Port process delivery.',
    'Presentation layer handles Translation, Encryption, and Compression.'
  ],

  quiz: [
    {
      id: 'q3-1',
      question: 'What is the correct Protocol Data Unit (PDU) at the Data Link Layer (Layer 2)?',
      options: ['Packet', 'Segment', 'Frame', 'Raw Bit'],
      correctIndex: 2,
      explanation: 'Layer 2 groups raw physical bits into structured "Frames" containing MAC source/destination addresses and CRC error trailers.'
    },
    {
      id: 'q3-2',
      question: 'Which OSI layer is responsible for end-to-end process-to-process delivery, flow control, and port addressing?',
      options: ['Network Layer', 'Transport Layer', 'Data Link Layer', 'Session Layer'],
      correctIndex: 1,
      explanation: 'The Transport Layer (Layer 4, TCP/UDP) handles true end-to-end delivery between specific applications using Port numbers.'
    },
    {
      id: 'q3-3',
      question: 'Data encryption, decryption, compression, and format translation are primarily performed by which layer?',
      options: ['Application Layer (L7)', 'Presentation Layer (L6)', 'Session Layer (L5)', 'Physical Layer (L1)'],
      correctIndex: 1,
      explanation: 'Layer 6 (Presentation) standardizes syntax and representation (e.g., ASCII, Unicode, TLS encryption, and JPEG/MPEG compression).'
    },
    {
      id: 'q3-4',
      question: 'Which is the ONLY layer in the OSI reference model that appends both a header AND a trailer (containing CRC/FCS)?',
      options: ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer'],
      correctIndex: 1,
      explanation: 'The Data Link Layer (Layer 2) wraps the network packet with a frame header (source/dest MAC) and a frame trailer (FCS/CRC error checking code).'
    },
    {
      id: 'q3-5',
      question: 'Which layer manages logical host-to-host packet routing across heterogeneous intermediate networks?',
      options: ['Session Layer', 'Transport Layer', 'Network Layer', 'Physical Layer'],
      correctIndex: 2,
      explanation: 'The Network Layer (Layer 3) handles IP addressing, packet routing, subnetting, and fragmentation across multiple routers.'
    },
    {
      id: 'q3-6',
      question: 'Dialog control, full/half-duplex session synchronization, and checkpoint rollback recovery are duties of which layer?',
      options: ['Session Layer (L5)', 'Presentation Layer (L6)', 'Transport Layer (L4)', 'Application Layer (L7)'],
      correctIndex: 0,
      explanation: 'The Session Layer (Layer 5) establishes, maintains, and synchronizes the interaction between communicating systems using checkpoint tokens.'
    },
    {
      id: 'q3-7',
      question: 'What is the fundamental addressing difference between Layer 2 and Layer 3?',
      options: [
        'Layer 2 uses 32-bit IP; Layer 3 uses 48-bit MAC',
        'Layer 2 uses physical MAC addresses for hop-to-hop delivery; Layer 3 uses logical IP addresses for source-to-destination delivery',
        'Layer 2 addresses are dynamically assigned by DHCP; Layer 3 addresses are burned into ROM',
        'Layer 2 handles port numbers; Layer 3 handles domain names'
      ],
      correctIndex: 1,
      explanation: 'MAC addresses are physical 48-bit identifiers used for hop-to-hop switching on a local link, whereas IP addresses are logical identifiers used for global end-to-end routing.'
    }
  ]
};

