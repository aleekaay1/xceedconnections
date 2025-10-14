
export interface SectionData {
  id: string;
  title: string;
  text: string;
  accentColor: string;
  textColor: string;
}

export const SECTIONS: SectionData[] = [
  {
    id: 'intro',
    title: 'Vektor Solutions',
    text: 'Building the Future — One System at a Time.',
    accentColor: '#FFFFFF',
    textColor: '#f0f0f0',
  },
  {
    id: 'medical',
    title: 'Medical Billing',
    text: 'Revolutionizing healthcare operations with precision billing and automation.',
    accentColor: '#00A9FF',
    textColor: '#d0f0ff',
  },
  {
    id: 'web',
    title: 'Web App Development',
    text: 'Design. Develop. Deploy. Crafting seamless digital experiences from concept to launch.',
    accentColor: '#00F5D4',
    textColor: '#d0fff8',
  },
  {
    id: 'robotics',
    title: 'Robotics',
    text: 'Engineering intelligent machines that redefine industrial efficiency and human capability.',
    accentColor: '#B4B4B4',
    textColor: '#e0e0e0',
  },
  {
    id: 'gaming',
    title: 'Gaming',
    text: 'Creating immersive worlds and captivating gameplay that push the boundaries of entertainment.',
    accentColor: '#9B5DE5',
    textColor: '#e8d8ff',
  },
  {
    id: 'blockchain',
    title: 'Blockchain Innovation',
    text: 'Building decentralized solutions for a transparent, secure, and interconnected future.',
    accentColor: '#00F0B5',
    textColor: '#d0ffef',
  },
  {
    id: 'outro',
    title: 'Welcome to the Future.',
    text: "Let's build it together.",
    accentColor: '#FFFFFF',
    textColor: '#f0f0f0',
  }
];
