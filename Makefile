nyc = ./node_modules/.bin/nyc
ava = ./node_modules/.bin/ava
js_files = $(shell find lib test -name "*.js")

test: tmp/test

tmp/test: $(js_files)
	$(nyc) --reporter=html $(ava) -v
	mkdir -p $(dir $@)
	touch $@
