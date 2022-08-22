import express from 'express';
import { getIPRange } from 'get-ip-range';

let ips = [];

const router = express.Router();

// Create the list by CIDR block
// cidr: 10.0.0.1/24
router.post('/create', (req, res) => {
  const { cidr } = req.body || {};
  if (!cidr) {
    res.send({
      status: 'error',
      message: 'Invalid cidr'
    });
  }
  ips = getIPRange(cidr).map((ip) => ({ ip, status: 'available' }));
  res.send({
    status: 'success',
    data: {
      length: ips.length
    }
  });
});

// List all ip addresses
router.get('/list', (req, res) => {
  res.send({
    status: 'success',
    data: ips
  });
});

const updateStatus = (req, res, status = 'acquire') => {
  const { ip } = req.body || {};
  if (!ip) {
    res.send({
      status: 'error',
      message: 'Invalid ip address'
    });
  }
  const selectedIp = ips.find(({ ip: storedIp }) => storedIp === ip);
  if (selectedIp) {
    selectedIp.status = status;
  }
  res.send({
    status: 'success',
    data: selectedIp
  });
};

// Acquire an ip
router.patch('/acquire', (req, res) => {
  updateStatus(req, res, 'acquire');
});

// Release an ip
router.patch('/release', (req, res) => {
  updateStatus(req, res, 'available');
});

export default router;
