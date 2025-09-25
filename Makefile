CC = gcc
CFLAGS = -Wall -Werror -O2
LIBS = -lcrypt

all: auth.cgi

auth.cgi: auth.c
	$(CC) $(CFLAGS) -o auth.cgi auth.c $(LIBS)
	chmod 755 auth.cgi

clean:
	rm -f auth.cgi