#!/bin/bash

vars=$(compgen -A variable)
subst=$(printf '${%s} ' $vars)
envsubst "$subst" < /etc/nginx/conf.d/vhost.template > /etc/nginx/nginx.conf
nginx -g 'daemon off;'

