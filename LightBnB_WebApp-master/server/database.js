const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

// the following assumes that you named your connection variable `pool`
// pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {console.log(response)})



// const properties = require('./json/properties.json');
// const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  return pool
  .query(`
    SELECT *
    FROM users
    WHERE email = $1`, [`${email}`])
  .then((result) => {
    console.log(result.rows);
    return result.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
  });
};
exports.getUserWithEmail = getUserWithEmail;





/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  return pool
  .query(`
    SELECT *
    FROM users
    WHERE id = $1`, [`${id}`])
  .then((result) => {
    console.log(result.rows);
    return result.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
  });
};
exports.getUserWithId = getUserWithId;





/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = (user) => {

  return pool
  .query(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;`, [`${user.name}`, `${user.email}`, `${user.password}`])  
    .then((result) => {
    console.log(result.rows);
    return result.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
// const getAllReservations = function(guest_id, limit = 10) {
//   return getAllProperties(null, 2);
// }




const getAllReservations = (guest_id) => {
  
  return pool
  .query(`
    SELECT properties.*
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
  ;`, [`${guest_id}`])  
    .then((result) => {
    console.log(result.rows);
    return result.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};

exports.getAllReservations = getAllReservations;

/// Properties




/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  
  console.log("options:", options);

  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // add if filtering by city
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `AND city LIKE $${queryParams.length} `;
  }

  // add if filtering by owner
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `AND owner_id = $${queryParams.length} `;
  }

  // add if filtering by minimum price
  if (options.minimum_price_per_night) {
    const minPrice = options.minimum_price_per_night * 100;
    queryParams.push(`${minPrice}`);
    queryString += `AND cost_per_night >= $${queryParams.length} `;
  }

  // add if filtering by minimum price
  if (options.maximum_price_per_night) {
    const maxPrice = options.maximum_price_per_night * 100;
    queryParams.push(`${maxPrice}`);
    queryString += `AND cost_per_night <= $${queryParams.length} `;
  }

  // add if filtering by minimum rating price
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `AND rating >= $${queryParams.length} `;
  }
  

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log("queryString, queryParams:", queryString, queryParams);


  return pool.query(queryString, queryParams)
  .then((result) => {
    // console.log(result.rows);
    return result.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};
exports.getAllProperties = getAllProperties;




/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
// const addProperty = function(property) {
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// }

const addProperty = (property) => {
  
  let queryString = `
  INSERT INTO properties (
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;`; 
  
  let queryParams = [
    `${property.owner_id}`,
    `${property.title}`,
    `${property.description}`,
    `${property.thumbnail_photo_url}`,
    `${property.cover_photo_url}`,
    `${property.cost_per_night}`,
    `${property.street}`,
    `${property.city}`,
    `${property.province}`,
    `${property.post_code}`,
    `${property.country}`,
    `${property.parking_spaces}`,
    `${property.number_of_bathrooms}`,
    `${property.number_of_bedrooms}`
  ];

  // let queryParams = [
  //   `%${property.owner_id}%`,
  //   `%${property.title}%`,
  //   `%${property.description}%`,
  //   `%${property.thumbnail_photo_url}%`,
  //   `%${property.cover_photo_url}%`,
  //   `%${property.cost_per_night}%`,
  //   `%${property.street}%`,
  //   `%${property.city}%`,
  //   `%${property.province}%`,
  //   `%${property.post_code}%`,
  //   `%${property.country}%`,
  //   `%${property.parking_spaces}%`,
  //   `%${property.number_of_bathrooms}%`,
  //   `%${property.number_of_bedrooms}%`
  // ];



  console.log("queryString:", queryString);
  console.log("queryParams:", queryParams);

  return pool.query(queryString, queryParams)
  .then((result) => {
    // console.log(result.rows);
    return result.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};
exports.addProperty = addProperty;


// console.log("arguments:", arguments);
