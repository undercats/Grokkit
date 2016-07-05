INSERT INTO users (username, email, first_name, last_name) VALUES
('Slam', 'slamcooksey@gmail.com', 'Samuel', 'Cooksey'),
('Gabe-o-Matic', 'gamethexton@gmail.com', 'Gabe', 'Thexton'),
('Moris-Less', 'jmorris@gmail.com', 'Jessica', 'Morris'),
('Iron-Man', 'Tony', 'Stark', 'Tstark@starkmail.com'),
('Captain-America', 'Steven', 'Rogers', 'SteveRogers@1940s.org');
INSERT INTO groups (title, description, leader_editable_only) VALUES
('Sam''s Cooking Class', 'Learn how to make all the finest quizine, from Ramen to Popcorn. We may even make quesadillas!', false),
('The Gabe Thexton Apple Museum Training Program', 'Be the best GTAM tour guides you can be. After this course you''ll be able to answer any question they throw at you', false ),
('Be the Bestrian Equestrian. With Jess!', 'Learn to Jump, Dance, and do all the other horse stuff!', True);
INSERT INTO users_groups (user_id, group_id, is_leader) VALUES
(1, 1, true),
(2, 2, true),
(3, 3, true),
(1, 2, false),
(1, 3, true),
(2, 1, true),
(2, 3, false),
(3, 1, false),
(3, 2, true),
(4, 1, false),
(4, 2, false),
(4, 3, false),
(5, 1, false),
(5, 2, false),
(5, 3, false);
