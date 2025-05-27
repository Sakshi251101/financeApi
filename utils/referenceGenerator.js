function generateReferenceIds(userId) {
  const timestamp = Date.now();
  return {
    serial_number: `SER${timestamp}${userId}`,
    reference_number: `REF${timestamp}${userId}`,
    application_number: `APP${timestamp}${userId}`,
    proposal_number: `PRP${timestamp}${userId}`,
    document_number: `DOC${timestamp}${userId}`
  };
}

module.exports = generateReferenceIds;
