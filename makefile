.PHONY: start-db run-backend stop-db

start-db:
	cd ./backend && docker compose up -d

stop-db:
	cd ./backend && docker compose down


start-backend:
	cd ./backend && npm run dev

run-backend: start-db start-backend


