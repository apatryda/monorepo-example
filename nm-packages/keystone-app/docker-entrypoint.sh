#!/bin/bash

set -e

yarn install
npx prisma generate

exec "$@"
