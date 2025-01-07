import db from "../config/db.js"; // Perbaiki import

// Fungsi untuk menambahkan user baru ke database
export const createUser = (userData, callback) => {
  const { id, username, email, password, phone_number, name } = userData;

  const query = `
    INSERT INTO user (id, username, email, password, phone_number, name) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [id, username, email, password, phone_number, name],
    (err, results) => {
      callback(err, results); // Callback untuk menangani hasil query
    }
  );
};

// Fungsi untuk mengambil semua user
export const getAllUsers = (callback) => {
  const query = `
    SELECT id, username, email, phone_number, name 
    FROM user
  `;
  db.query(query, (err, results) => {
    callback(err, results);
  });
};

// Fungsi untuk mengambil user berdasarkan ID
export const getUserById = (id, callback) => {
  const query = `
    SELECT id, username, email, phone_number, name 
    FROM user 
    WHERE id = ?
  `;
  db.query(query, [id], (err, results) => {
    callback(err, results.length > 0 ? results[0] : null); // Kirim hasil atau null jika tidak ditemukan
  });
};

// Fungsi untuk mengambil user berdasarkan username
export const getUserByUsername = (username, callback) => {
  const query = `
    SELECT * 
    FROM user 
    WHERE username = ?
  `;
  db.query(query, [username], (err, results) => {
    callback(err, results.length > 0 ? results[0] : null); // Kirim hasil atau null jika tidak ditemukan
  });
};

// Fungsi untuk mengambil user berdasarkan email
export const getUserByEmail = (email, callback) => {
  const query = `
    SELECT * 
    FROM user 
    WHERE email = ?
  `;
  db.query(query, [email], (err, results) => {
    callback(err, results.length > 0 ? results[0] : null);
  });
};

// Fungsi untuk mengupdate data user
export const updateUser = (id, updatedData, callback) => {
  const { username, email, phone_number, name } = updatedData;

  const query = `
    UPDATE user 
    SET username = ?, email = ?, phone_number = ?, name = ? 
    WHERE id = ?
  `;
  db.query(query, [username, email, phone_number, name, id], (err, results) => {
    callback(err, results);
  });
};

// Fungsi untuk menghapus user berdasarkan ID
export const deleteUser = (id, callback) => {
  const query = `
    DELETE FROM user 
    WHERE id = ?
  `;
  db.query(query, [id], (err, results) => {
    callback(err, results);
  });
};

// Fungsi untuk mengupdate password user
export const updatePassword = (id, newPassword, callback) => {
  const query = `
    UPDATE user 
    SET password = ? 
    WHERE id = ?
  `;
  db.query(query, [newPassword, id], (err, results) => {
    callback(err, results);
  });
};

// Tambahkan fungsi helper untuk profile
export const getUserProfileFromDb = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT id, username, email, phone_number, name 
            FROM user 
            WHERE id = ?
        `;
        db.query(query, [userId], (err, results) => {
            if (err) reject(err);
            else resolve(results[0]);
        });
    });
};
