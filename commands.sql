CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('Hanns', 'www.rackflow.app', 'Meganote', 5);
insert into blogs (title) values ('Minimum Note');

-- postgres=# select * from blogs;
--  id | author |        url         |    title     | likes 
-- ----+--------+--------------------+--------------+-------
--   1 | Hanns  | www.rackflow.app   | Meganote     |     5
--   3 |        | yankee.go-home.com | Minimum Note |     0
-- (2 rows)

-- postgres=# 

