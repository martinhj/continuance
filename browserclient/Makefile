BROWSER=open /Applications/Safari.app/
CFLAGS=-g
TARGET=index

index:
	@$(BROWSER) $(CFLAGS) http://pitr.local/~martinhj/syncScrolling/; \
	kill -19 `ps aux|grep -v grep |grep "node reloader.js" |awk '{print $$2}'`
