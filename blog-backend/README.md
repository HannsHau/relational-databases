Docker Database created:
docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres

docker ps

docker exec -it d918 psql -U postgres postgres

\d notes (shift + option + 7)

Data is actually not saved inside the contain. If wished a volume must added.

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    important boolean,
    date time
);

insert into notes (content, important) values ('Relational databases rule the world', true);
insert into notes (content, important) values ('MongoDB is webscale', false);
