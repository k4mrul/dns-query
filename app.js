import express from 'express';
import dns from 'dns/promises';

// Set a custom DNS server (e.g., Google Public DNS)
// dns.setServers(['8.8.8.8']);

const app = express();
const PORT = 3000;

app.get('/query', async (req, res) => {
  const domain = req.query.domain;
  
  if (!domain) {
    return res.status(400).send('Please provide a domain parameter, e.g., ?domain=example.com');
  }

  try {
    const results = {};

    // Query multiple record types
    results.A = await dns.resolve(domain, 'A').catch(() => []);
    results.AAAA = await dns.resolve(domain, 'AAAA').catch(() => []);
    results.CNAME = await dns.resolve(domain, 'CNAME').catch(() => []);
    results.MX = await dns.resolve(domain, 'MX').catch(() => []);
    results.TXT = await dns.resolve(domain, 'TXT').catch(() => []);
    results.NS = await dns.resolve(domain, 'NS').catch(() => []);

    // Log results to console
    console.log(`DNS results for ${domain}:`, results);

    // Send results as JSON response
    res.json(results);
  } catch (error) {
    console.error('Error querying domain:', error);
    res.status(500).send('An error occurred while querying the domain.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
