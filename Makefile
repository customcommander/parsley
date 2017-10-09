nyc = ./node_modules/.bin/nyc
ava = ./node_modules/.bin/ava
babel = ./node_modules/.bin/babel

js_files = $(shell find lib test -name "*.js")

test: tmp/test
dist: tmp/dist
clean:; rm -rfv tmp

tmp/test: $(js_files)
	$(nyc) --reporter=html $(ava) -v
	mkdir -p $(dir $@)
	touch $@

tmp/dist: $(js_files)
	$(babel) lib -d dist
	mkdir -p $(dir $@)
	touch $@