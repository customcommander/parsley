nyc = ./node_modules/.bin/nyc
ava = ./node_modules/.bin/ava

js_files = $(find lib test -name "*.js")

.PHONY: test
test: tmp/test

tmp/test: $(js_files)
	$(nyc) --reporter=html $(ava) -v
	mkdir $(dir $@)
	touch $@
