export default {
  id: 'cn-1-6-transmission-media',
  number: '06',
  title: 'Types of Transmission Medium (Guided & Unguided)',
  syllabusMapping: 'Types of Transmission Medium',
  summary: 'Physical transmission conduits carrying electromagnetic signals, contrasting guided copper/optical cables with unguided radio, microwave, and infrared wireless spectra.',
  
  examWeightage: {
    marks: '5 to 10 Marks',
    frequency: 'Regularly asked in Mumbai University examinations (Differentiate between UTP and STP, or Single-Mode vs Multi-Mode Fiber)',
    expectedQuestions: [
      'Classify transmission media. Differentiate between Guided and Unguided media.',
      'Explain the construction and working principle of Optical Fiber Cable. Differentiate between Single-Mode and Multi-Mode fibers.',
      'Differentiate between UTP and STP cables. Why are copper wires twisted together?'
    ]
  },

  theory: `
### 1. Classification of Transmission Media
Transmission media sit at the Physical Layer (Layer 1) beneath network software, carrying electrical, optical, or electromagnetic signals between transmitting and receiving nodes.

\`\`\`
Transmission Media
├── Guided (Wired / Bounded)
│   ├── Twisted Pair Cable (UTP & STP)
│   ├── Coaxial Cable (Baseband & Broadband)
│   └── Optical Fiber Cable (Single-Mode & Multi-Mode)
└── Unguided (Wireless / Unbounded)
    ├── Radio Waves (3 kHz – 1 GHz, Omnidirectional)
    ├── Microwaves (1 GHz – 300 GHz, Line-of-Sight)
    └── Infrared (300 GHz – 400 THz, Confined to Rooms)
\`\`\`

---

### 2. Guided Transmission Media

#### A. Twisted Pair Cable
* Consists of two insulated copper wires twisted together in a helical form.
* **Why are wires twisted?** Twisting ensures that both wires are equally exposed to external electromagnetic interference (EMI) and crosstalk from adjacent pairs. The receiver takes the difference between the signals, mathematically canceling out the common noise.
* **Types**:
  * **UTP (Unshielded Twisted Pair)**: Inexpensive, flexible, standard for indoor LANs (Categories: Cat5e up to 1 Gbps, Cat6 up to 10 Gbps at 100m). Terminates with **RJ-45** connectors.
  * **STP (Shielded Twisted Pair)**: Enclosed in a metal foil braid to block high industrial electrical noise; heavier and more costly.

#### B. Coaxial Cable
* Consists of a central copper conductor surrounded by a dielectric plastic insulator, covered by a braided metal mesh shield and an outer plastic sheath.
* **Types**:
  * **Baseband Coaxial (50 $\\Omega$)**: Transmits digital signals directly (used in legacy Ethernet 10Base2/10Base5).
  * **Broadband Coaxial (75 $\\Omega$)**: Uses analog signaling and frequency multiplexing (standard for Cable Television and DOCSIS cable internet).
* **Connectors**: BNC connector, BNC T-connector, and BNC terminator.

#### C. Optical Fiber Cable
* Transmits pulses of light through transparent glass or plastic strands.
* **Working Principle: Total Internal Reflection (TIR)**.
  The refractive index of the glass **Core** ($n_1$) is strictly greater than the refractive index of the surrounding **Cladding** ($n_2$). When light enters at an angle greater than the **critical angle**, it reflects entirely inside the core without leaking.
* **Comparison of Fiber Types**:

| Parameter | Single-Mode Fiber (SMF) | Multi-Mode Fiber (MMF) |
| :--- | :--- | :--- |
| **Core Diameter** | Very small ($\approx 8 - 10 \\ \\mu\\text{m}$) | Larger ($\approx 50 - 62.5 \\ \\mu\\text{m}$) |
| **Light Source** | Injection Laser Diode (ILD) | Light Emitting Diode (LED) |
| **Light Propagation** | Single direct ray (zero modal dispersion) | Multiple rays bouncing at varying angles |
| **Distance & Speed** | Very long distances (up to 100 km+ without repeaters), extremely high speeds | Shorter distances ($\le 2$ km, campus backbones) |
| **Cost** | Higher manufacturing and laser transceiver cost | Lower installation and LED transceiver cost |

---

### 3. Unguided (Wireless) Transmission Media

#### A. Radio Waves (3 kHz to 1 GHz)
* **Omnidirectional**: Signals spread in all directions from the transmitter antenna.
* **Characteristics**: Can penetrate physical walls and buildings easily; susceptible to interference from electrical motors.
* **Applications**: AM/FM radio broadcasting, cellular mobile telephony, cordless phones.

#### B. Microwaves (1 GHz to 300 GHz)
* **Unidirectional (Line-of-Sight)**: Sending and receiving antennas must be precisely aligned.
* **Characteristics**: High bandwidth; cannot penetrate tall physical obstacles or rain curvature without attenuation.
* **Applications**: Cellular base-station backhaul towers, parabolic dish satellite links, WiMAX.

#### C. Infrared Waves (300 GHz to 400 THz)
* **Characteristics**: Extremely high frequency, cannot penetrate solid walls. This physical containment makes it secure against adjacent room eavesdropping.
* **Applications**: Television remotes, short-range device data links (IrDA).

---

### 4. Transmission Impairments (Signal Degradation)
1. **Attenuation**: Loss of signal energy over distance as electrical resistance converts signal power into heat (compensated by Amplifiers and Repeaters).
2. **Distortion**: Alteration of signal shape due to different frequency components traveling at slightly different velocities.
3. **Noise**: Unwanted external energy added to the signal (Thermal noise, Induced noise, Crosstalk, and Impulse spikes).
  `,

  keyTakeaways: [
    'Twisted pair reduces crosstalk and EMI through differential signaling and helical twisting.',
    'Optical fiber operates on Total Internal Reflection (Core refractive index > Cladding refractive index).',
    'Single-Mode Fiber uses laser diodes for long-distance zero-dispersion transmission.',
    'Radio waves are omnidirectional; Microwaves are line-of-sight unidirectional.'
  ],

  quiz: [
    {
      id: 'q6-1',
      question: 'Why are copper wire pairs twisted helically in UTP and STP Ethernet cables?',
      options: [
        'To reduce wire resistance and double data speed',
        'To cancel out electromagnetic interference (EMI) and crosstalk from adjacent pairs via differential signaling',
        'To prevent electrical current from generating static shock',
        'To allow optical light to propagate through copper'
      ],
      correctIndex: 1,
      explanation: 'Twisting exposes both copper conductors equally to surrounding electromagnetic fields, allowing the receiver to subtract common-mode noise mathematically.'
    },
    {
      id: 'q6-2',
      question: 'What physical optical condition must be satisfied for Total Internal Reflection (TIR) to occur in fiber optic cables?',
      options: [
        'Core refractive index must be greater than cladding refractive index (n1 > n2), and angle of incidence must exceed critical angle',
        'Core refractive index must be smaller than cladding (n1 < n2)',
        'The cable must be immersed in optical mineral oil',
        'The light source must be strictly infrared LED without lasers'
      ],
      correctIndex: 0,
      explanation: 'Light rays remain trapped inside the high-density glass core (n1) whenever they strike the lower-density cladding (n2) at an angle greater than the critical angle.'
    },
    {
      id: 'q6-3',
      question: 'Which wireless transmission medium cannot penetrate solid walls, making it secure against eavesdropping in adjacent conference rooms?',
      options: ['Low-frequency Radio waves', 'Terrestrial Microwaves', 'Infrared waves', 'Cellular 5G'],
      correctIndex: 2,
      explanation: 'Infrared frequencies (300 GHz to 400 THz) are stopped by solid physical barriers such as walls, making it impossible for signals to leak outside the room.'
    },
    {
      id: 'q6-4',
      question: 'What is the primary difference between Single-Mode Fiber (SMF) and Multi-Mode Fiber (MMF)?',
      options: [
        'SMF uses copper core; MMF uses glass core',
        'SMF has a narrow core (8-10 µm) and eliminates modal dispersion using laser diodes for long distances; MMF has a wider core (50-62.5 µm) using LEDs for LANs',
        'MMF has zero attenuation over transoceanic subsea links',
        'SMF carries 10 times more light beams simultaneously than MMF'
      ],
      correctIndex: 1,
      explanation: 'Single-mode fiber allows only one optical ray path, eliminating modal dispersion and allowing data to travel 80+ km without repeaters.'
    },
    {
      id: 'q6-5',
      question: 'Which transmission impairment refers to the progressive loss of signal amplitude/energy as it travels through copper resistance?',
      options: ['Distortion', 'Attenuation', 'Crosstalk', 'Phase jitter'],
      correctIndex: 1,
      explanation: 'Attenuation is the reduction in signal strength over distance as electrical energy is dissipated as heat, requiring repeaters or amplifiers.'
    },
    {
      id: 'q6-6',
      question: 'Why do terrestrial Microwave communication links require tall parabolic dish towers positioned within direct line-of-sight?',
      options: [
        'Microwave signals reflect off the ionosphere like shortwave radio',
        'Microwaves travel strictly in straight lines and cannot bend around the curvature of the Earth or penetrate hills',
        'Tower height provides electrical grounding against thunderstorms',
        'Microwaves can only transmit in vacuum chambers'
      ],
      correctIndex: 1,
      explanation: 'Above 1 GHz, electromagnetic waves travel in narrow straight beams and cannot bend with the Earth\'s curvature, requiring repeater towers every 40-50 km.'
    },
    {
      id: 'q6-7',
      question: 'What is the standard category rating of twisted-pair copper cable designed for gigabit speeds (1 Gbps) over 100 meters in campus LANs?',
      options: ['Cat 3', 'Cat 5e / Cat 6', 'Cat 1', 'RG-58'],
      correctIndex: 1,
      explanation: 'Cat 5e (100 MHz) and Cat 6 (250 MHz) are rated for 1 Gbps Gigabit Ethernet (1000BASE-T) up to the standard 100-meter channel length.'
    }
  ]
};

