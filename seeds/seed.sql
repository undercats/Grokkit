INSERT INTO users (username, email, first_name, last_name, display_name, user_image) VALUES
('Slam', 'slamcooksey@gmail.com', 'Samuel', 'Cooksey', 'Sam Cooksey', 'http://www.batmandarkknightcostumes.com/images/child-batman-mask.jpg'),
('gabethexton', 'gamethexton@gmail.com', 'Gabe', 'Thexton', 'Gabe Thexton', 'http://logok.org/wp-content/uploads/2014/04/Apple-Logo-rainbow.png'),
('Moris-Less', 'jmorris@gmail.com', 'Jessica', 'Morris', 'Jess Morris', 'https://pbs.twimg.com/profile_images/2770939513/31605879c72d5738aec6d3a3f6bdb014.gif'),
('Iron-Man', 'Tstark@starkmail.com', 'Tony', 'Stark', 'Tony Stark', 'http://cdn.s7.shop.marvel.com/is/image/MarvelStore/7200000411ZES?$marveldotcom$'),
('Captain-America', 'SteveRogers@1940s.org', 'Steven', 'Rogers', 'Captain America', 'http://nerdist.com/wp-content/uploads/2016/05/Captain-America-Shield-322x268.jpg');
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
INSERT INTO topics (group_id, title, description, is_old) VALUES
(1, 'Heating water for Ramen', 'Turn it to hot and wait', false),
(1, 'Waiting the right amount of time for microwave popcorn', 'about 1-2 seconds between pops', false),
(2, 'Greeting the guest', 'say ''Hello!''', false),
(2, 'Saying goodbye to the guest', 'say ''Goodbye!''', false),
(3, 'Don''t fall', 'stay on top of the horse', false),
(3, 'Be nice to your horse', 'The horse is your friend! Treat it that way!', false);
INSERT INTO groks (user_id, topic_id, rating, comment) VALUES
(1, 3, 3, 'I don''t get it'),
(1, 5, 5, null),
(2, 2, 7, 'I get it!'),
(2, 5, 10, null),
(3, 2, 1, null),
(3, 3, 2, null),
(3, 4, 3, 'I kinda get it...'),
(4, 2, 6, null),
(4, 3, 7, 'Iron Man!'),
(4, 5, 9, 'I''m steve!'),
(5, 2, 0, null),
(5, 3, 1, null),
(5, 4, 2, 'America!'),
(1, 6, 4, null),
(2, 6, 5, 'I hate horses'),
(4, 6, 7, 'I love horses'),
(5, 6, 8, 'America!');
