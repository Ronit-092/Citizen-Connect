export const exportToCSV = (complaints: any[], filename: string = 'complaints') => {
  if (complaints.length === 0) {
    return;
  }

  // Define CSV headers
  const headers = [
    'ID',
    'Title',
    'Description',
    'Category',
    'Priority',
    'Status',
    'Location',
    'Area',
    'City',
    'State',
    'Pincode',
    'Landmark',
    'Created Date',
    'Updated Date',
    'Resolved Date'
  ];

  // Convert complaints to CSV rows
  const rows = complaints.map(complaint => [
    complaint.id || '',
    complaint.title || '',
    complaint.description || '',
    complaint.category || '',
    complaint.priority || '',
    complaint.status || '',
    complaint.location?.address || '',
    complaint.location?.area || '',
    complaint.location?.city || '',
    complaint.location?.state || '',
    complaint.location?.pincode || '',
    complaint.location?.landmark || '',
    complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : '',
    complaint.updatedAt ? new Date(complaint.updatedAt).toLocaleDateString() : '',
    complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleDateString() : ''
  ]);

  // Escape values that contain commas or quotes
  const escapeCSV = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (complaints: any[], filename: string = 'complaints') => {
  if (complaints.length === 0) {
    return;
  }

  const jsonContent = JSON.stringify(complaints, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
