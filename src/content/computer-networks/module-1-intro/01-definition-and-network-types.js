export default {
  id: 'cn-1-1-definition-and-types',
  number: '01',
  title: 'Definition & Types of Networks (LAN, MAN, WAN, Wireless)',
  syllabusMapping: 'Definition, Types of Networks: Local area networks (LAN), Metropolitan area networks (MAN), Wide area networks (WAN), Wireless networks',
  summary: 'Fundamental concepts of data communication systems and classification of networks based on geographical scale, architecture, and transmission technology.',
  
  examWeightage: {
    marks: '5 to 10 Marks',
    frequency: 'Asked frequently in MU Question 1 (Short Notes) or Question 2 (Comparative analysis)',
    expectedQuestions: [
      'Define Computer Network. State four major goals of networking.',
      'Differentiate between LAN, MAN, and WAN with respect to range, speed, topology, and transmission media.',
      'Explain Wireless Networks and distinguish between WLAN (802.11) and WPAN (Bluetooth/Zigbee).'
    ]
  },

  theory: `
### 1. Definition of Computer Network
A **Computer Network** is an interconnected collection of autonomous computing nodes that exchange data, share resources (hardware, software, storage), and establish communication using a common set of transmission protocols over physical or wireless media.

* **Autonomous**: No computer can forcefully start, stop, or control another without delegated authorization.
* **Interconnected**: Devices can exchange information through guided cables (copper, fiber) or unguided wireless channels (radio, microwave).

#### Primary Goals & Applications:
1. **Resource Sharing**: Sharing costly printers, compute clusters, databases, and centralized storage pools (SAN/NAS).
2. **High Reliability**: Replication across alternate servers ensures fault tolerance if one machine fails.
3. **Cost Reduction**: Personal workstations connected to shared servers achieve higher price-to-performance ratios than isolated mainframes.
4. **Communication Medium**: Rapid collaboration via email, instant messaging, distributed video conferencing, and cloud services.

---

### 2. Classification of Networks by Geographical Scale

| Feature | LAN (Local Area Network) | MAN (Metropolitan Area Network) | WAN (Wide Area Network) |
| :--- | :--- | :--- | :--- |
| **Geographical Area** | Small (Room, Lab, Building, Campus up to 1-2 km) | City, Town, Large University Campus (5-50 km) | Country, Continent, or Global (Worldwide) |
| **Data Rate (Speed)** | High (100 Mbps to 10 Gbps) | Moderate (10 Mbps to 1 Gbps) | Moderate to Low (Mbps to Gbps via leased lines) |
| **Error Rate** | Very Low (High-quality shielded cables) | Moderate | Higher (Transmission over long noisy links) |
| **Ownership** | Private (Single organization or household) | Private or Public Consortium (Cable TV, ISP) | Shared / Multiple Telecom Carriers & ISPs |
| **Transmission Media** | UTP (Cat5e/Cat6), Wi-Fi (802.11), Fiber | Optical Fiber Cable, Microwave, Coaxial | Satellite Links, Submarine Fiber, Leased Lines |
| **Example** | College Computer Lab, Office Wi-Fi | City Cable Network, Metropolitan Metro Rail Network | The Global Internet, National Defence Network |

---

### 3. Detailed Study of Network Types

#### A. Local Area Network (LAN)
* Confined to a single office, laboratory, or building.
* Employs shared transmission medium with bus, star, or switched topologies.
* **Standard Technologies**: IEEE 802.3 (Ethernet) utilizing RJ45 Twisted Pair or Fiber cables, and IEEE 802.11 (Wi-Fi).
* **Characteristics**: Low propagation delay, high data throughput, minimal bit error rates.

#### B. Metropolitan Area Network (MAN)
* Spans an entire city or large municipal region.
* Connects multiple local LANs across branches using high-capacity optical backbones.
* **Standard Technologies**: Optical Ethernet, DQDB (Distributed Queue Dual Bus), WiMAX (IEEE 802.16), and Cable Broadband.
* **Common Use Case**: Interconnecting bank branches across Mumbai or distributing city-wide digital surveillance camera feeds to municipal headquarters.

#### C. Wide Area Network (WAN)
* Spans geographical boundaries of nations, continents, or the entire planet.
* Composed of:
  * **Hosts / End Systems**: User computers running application processes.
  * **Communication Subnet**: Transmission lines (circuits/channels) and switching elements (Routers) that transport packets from source host to destination host.
* **Technologies**: MPLS (Multi-Protocol Label Switching), Frame Relay, ATM, Packet-Switched Internet Protocol routing, and Subsea fiber cables.

---

### 4. Wireless Networks
Networks utilizing electromagnetic spectrum (Radio frequency, Microwave, Infrared) rather than physical copper or optical cables:
* **WPAN (Wireless Personal Area Network)**: Range < 10 meters. Technologies: Bluetooth (IEEE 802.15.1), Zigbee (802.15.4), and NFC for short-range peripheral connection.
* **WLAN (Wireless Local Area Network)**: Range ~ 50–100 meters. Technology: IEEE 802.11a/b/g/n/ac/ax (Wi-Fi), operating on 2.4 GHz and 5 GHz frequency bands.
* **WWAN (Wireless Wide Area Network)**: Range over cities and countries. Technology: Cellular mobile networks (4G LTE, 5G NR) and Satellite broadband (Starlink, OneWeb).
  `,

  keyTakeaways: [
    'A network requires autonomous computing devices communicating via shared protocols.',
    'LAN = Lowest latency, lowest error rate, private ownership.',
    'WAN uses a communication subnet (switching routers + transmission circuits) to interconnect separate LANs.',
    'Wireless networks are categorized by coverage into WPAN (Bluetooth), WLAN (Wi-Fi), WMAN (WiMAX), and WWAN (Cellular 4G/5G).'
  ],

  quiz: [
    {
      id: 'q1-1',
      question: 'Which network type operates with the lowest latency, lowest bit error rate, and is typically privately owned?',
      options: ['Wide Area Network (WAN)', 'Local Area Network (LAN)', 'Metropolitan Area Network (MAN)', 'Wireless WAN (WWAN)'],
      correctIndex: 1,
      explanation: 'LANs cover geographically small areas (like a college lab or office) using high-grade shielded cables, providing high data rates (1 Gbps+) with minimal bit error.'
    },
    {
      id: 'q1-2',
      question: 'What is the standard operational range of a Wireless Personal Area Network (WPAN) like Bluetooth or Zigbee?',
      options: ['Up to 10 meters', 'Up to 100 meters', 'Up to 5 kilometers', 'Up to 50 kilometers'],
      correctIndex: 0,
      explanation: 'WPANs (IEEE 802.15.1 Bluetooth / Zigbee) are designed for short-range personal device interconnection within approximately 10 meters.'
    },
    {
      id: 'q1-3',
      question: 'In the formal definition of a computer network, what does the term "Autonomous" strictly imply?',
      options: [
        'Computers are controlled by a single centralized master operating system',
        'No computer can forcefully start, stop, or control another without delegated authorization',
        'Computers communicate without physical or wireless transmission links',
        'All machines run automated artificial intelligence algorithms'
      ],
      correctIndex: 1,
      explanation: 'Autonomous means every computing node retains independent processing control and cannot be forcefully taken over without delegated permissions.'
    },
    {
      id: 'q1-4',
      question: 'A network connecting multiple bank branches or municipal offices across a single metropolitan city (5 to 50 km) is classified as:',
      options: ['Local Area Network (LAN)', 'Personal Area Network (PAN)', 'Metropolitan Area Network (MAN)', 'Storage Area Network (SAN)'],
      correctIndex: 2,
      explanation: 'Metropolitan Area Networks (MANs) span entire cities or large municipal regions, typically utilizing high-capacity optical backbones or DQDB/WiMAX.'
    },
    {
      id: 'q1-5',
      question: 'In Wide Area Network (WAN) architecture, the collection of transmission lines and intermediate routers that move packets is called the:',
      options: ['Access Point Cluster', 'Communication Subnet', 'Demilitarized Zone', 'Logical Topography'],
      correctIndex: 1,
      explanation: 'A WAN consists of hosts (user machines) and a Communication Subnet, which is made of transmission lines (circuits) and switching elements (routers).'
    },
    {
      id: 'q1-6',
      question: 'Which IEEE standard specification defines Wireless Local Area Networks (WLAN / Wi-Fi)?',
      options: ['IEEE 802.3', 'IEEE 802.11', 'IEEE 802.15', 'IEEE 802.16'],
      correctIndex: 1,
      explanation: 'IEEE 802.11 defines WLAN standards (Wi-Fi 4/5/6), whereas 802.3 defines wired Ethernet and 802.15 defines WPAN (Bluetooth).'
    },
    {
      id: 'q1-7',
      question: 'Cellular network technologies such as 4G LTE and 5G NR that provide nationwide coverage belong to which category?',
      options: ['Wireless Personal Area Network (WPAN)', 'Wireless Local Area Network (WLAN)', 'Wireless Wide Area Network (WWAN)', 'Campus Area Network (CAN)'],
      correctIndex: 2,
      explanation: 'WWANs utilize licensed cellular mobile frequency bands and satellite links to deliver wide-area wireless internet across countries.'
    }
  ]
};

