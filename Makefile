NAME=escape-to-close-overview
DOMAIN=anatolyeltsov

DEST_DIR=dist
FILES_TO_COPY = metadata.json README.md LICENSE

.PHONY: all pack install clean

all: ${DEST_DIR}/extension.js

node_modules/.package-lock.json: package.json
	npm install

${DEST_DIR}/extension.js: node_modules/.package-lock.json *.ts
	npm run build

$(NAME).zip: ${DEST_DIR}/extension.js
	@cp ${FILES_TO_COPY} ${DEST_DIR}/
	@(cd ${DEST_DIR} && zip ../$(NAME).zip -9r .)

pack: $(NAME).zip

install: $(NAME).zip
	gnome-extensions install --force $(NAME).zip

uninstall:
	gnome-extensions uninstall $(NAME)@${DOMAIN}

clean:
	@rm -rf ${DEST_DIR} node_modules $(NAME).zip
