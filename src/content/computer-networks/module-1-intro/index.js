import meta from './meta.json';
import c1 from './01-definition-and-network-types';
import c2 from './02-network-software-and-protocols';
import c3 from './03-osi-reference-model';
import c4 from './04-tcp-ip-model';
import c5 from './05-network-topologies';
import c6 from './06-transmission-media';
import c7 from './07-network-architectures';
import c8 from './08-network-hardware-devices';
import c9 from './09-campus-wide-networking';

export const module1Intro = {
  ...meta,
  concepts: [c1, c2, c3, c4, c5, c6, c7, c8, c9].map(c => ({
    ...c,
    name: c.title,
    desc: c.summary
  }))
};

export default module1Intro;
