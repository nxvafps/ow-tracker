#!/usr/bin/env bash

for file in *.sql; do
    psql -f "${file}" > ${file%.sql}.md
done