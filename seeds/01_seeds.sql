INSERT INTO users (name, email, password)
VALUES
('Dwayne Johnson', 'the@rock.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Steven Segall', 'bad@actor.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Chuck Norris', 'chuck@norris.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES
(1, 'House', 'Description', 'img1.com', 'img2.com', 75, 1, 3, 4, 'Canada', 'Main St.', 'Vancouver', 'British Columbia', 'A1B 2C3'),
(2, 'Apartment', 'Description', 'img1.com', 'img2.com', 85, 1, 2, 2, 'Canada', 'Side St.', 'Vancouver', 'British Columbia', 'A1B 2C4'),
(3, 'Cottage', 'Description', 'img1.com', 'img2.com', 95, 1, 2, 3, 'Canada', 'Offroad St.', 'Vancouver', 'British Columbia', 'A1B 2C5');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES
('2022-01-03', '2022-01-08', 1, 2),
('2022-01-03', '2022-01-08', 2, 3),
('2022-01-03', '2022-01-08', 3, 1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES
(2, 1, 1, 5, 'message1'),
(3, 2, 2, 5, 'message2'),
(1, 3, 3, 5, 'message3');