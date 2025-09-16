// Simple script to add test data to Supabase
// Run this in your browser console on your Supabase project's SQL editor

const testLeads = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    company: "Acme Corp",
    status: "New",
    consent: "Yes",
    consent_date: "2024-01-15",
    state: "California",
    assigned_to: "default-user-id"
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1987654321",
    company: "Tech Solutions",
    status: "Contacted",
    consent: "No",
    consent_date: null,
    state: "New York",
    assigned_to: "default-user-id"
  },
  {
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "+1555123456",
    company: "Global Inc",
    status: "Qualified",
    consent: "Yes",
    consent_date: "2024-06-20",
    state: "Texas",
    assigned_to: "default-user-id"
  }
];

// Insert test leads
INSERT INTO leads (name, email, phone, company, status, consent, consent_date, state, assigned_to)
VALUES 
  ('John Doe', 'john.doe@example.com', '+1234567890', 'Acme Corp', 'New', 'Yes', '2024-01-15', 'California', 'default-user-id'),
  ('Jane Smith', 'jane.smith@example.com', '+1987654321', 'Tech Solutions', 'Contacted', 'No', null, 'New York', 'default-user-id'),
  ('Bob Johnson', 'bob.johnson@example.com', '+1555123456', 'Global Inc', 'Qualified', 'Yes', '2024-06-20', 'Texas', 'default-user-id');

-- Also add a test user
INSERT INTO users (id, username, email, first_name, last_name, role)
VALUES ('default-user-id', 'testuser', 'test@example.com', 'Test', 'User', 'agent')
ON CONFLICT (id) DO NOTHING;
