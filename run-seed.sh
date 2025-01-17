#!/usr/bin/env bash
psql -f "db/01-seed.sql" > db/01-seed.md

for file in "db/queries/"*.sql; do
    psql -f "${file}" > ${file%.sql}.md
done