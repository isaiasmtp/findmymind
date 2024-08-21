export const settings = {
  base_url: 'https://localhost',
};

export const throttlerConfig = [
  {
    name: 'short',
    ttl: 1000,
    limit: 20,
  },
  {
    name: 'medium',
    ttl: 10000,
    limit: 200,
  },
];
