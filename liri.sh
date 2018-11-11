#!/bin/bash
while true; do
echo What command would like to run?
read command
    case "$command" in
        "my-tweets" | "do-what-it-says")
            node liri.js "$command" ;;

        "spotify-this-song" | "movie-this")
            echo What item would like to query?
            read item
            node liri.js "$command" $item ;;
        "end")
            break ;;
        *)
            echo "Unknown command: $command" ;;

    esac
done
