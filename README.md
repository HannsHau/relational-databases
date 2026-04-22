Docker Database created:
docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres

docker ps

docker exec -it d918 psql -U postgres postgres

\d notes (shift + option + 7)

Data is actually not saved inside the contain. If wished a volume must added.

