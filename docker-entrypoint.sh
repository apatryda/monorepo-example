#!/bin/bash

set -e

exec yarn workspace "@example/${WORKSPACE_NAME}" "$@"
