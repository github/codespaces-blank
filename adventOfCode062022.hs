module AOC6.Answer ( aoc6
                   , vierGleiche
                   , show6
                   , solution6
                   , main
                   )
    where

import System.Environment ( getArgs )
import System.Directory ( doesFileExist )

--finds a marker with alength of 4 -> for every nonmatching block of four symbols
vierGleiche :: String -> [Bool]
vierGleiche (a:b:c:d:ds) = if ((length (a:b:c:d:ds))<4)
    then[False]
    else if ((a==b) || (a==c) || (a==d) || (b==c) || (b==d) || (c==d))
        then False : (vierGleiche (b:c:d:ds))
        else [True]
        
        
--the length of the datastream until the start-of-packet marker (itself included)
show6 :: String -> String
show6 as = show ((length (vierGleiche as)) + 3)

--only for a betterlooking output
solution6 :: String -> String
solution6 as = "Solution Day 6 Part 1 " ++ (show6 as)

--------------------------------------the same as above (for the second part) --------------------------------------------------------------------
vierzehnGleiche :: String -> [Bool]
vierzehnGleiche (a:b:c:d:e:f:g:h:i:j:k:l:m:n:ns) = if ((length (a:b:c:d:e:f:g:h:i:j:k:l:m:n:ns))<14)
    then [False]
    else if ((elem a (b:c:d:e:f:g:h:i:j:k:l:m:n:[])) || (elem b (c:d:e:f:g:h:i:j:k:l:m:n:[])) || (elem c (d:e:f:g:h:i:j:k:l:m:n:[])) || (elem d (e:f:g:h:i:j:k:l:m:n:[])) || (elem e (f:g:h:i:j:k:l:m:n:[])) || (elem f (g:h:i:j:k:l:m:n:[])) || (elem g (h:i:j:k:l:m:n:[])) || (elem h (i:j:k:l:m:n:[])) || (elem i (j:k:l:m:n:[])) || (elem j (k:l:m:n:[])) || (elem k (l:m:n:[])) || (elem l (m:n:[])) || (elem m (n:[])))
        then False : (vierzehnGleiche (b:c:d:e:f:g:h:i:j:k:l:m:n:ns))
        else [True]

show62 :: String -> String
show62 as = show ((length (vierzehnGleiche as)) + 13)

solution62 :: String -> String
solution62 as = "Solution Day 6 Part 2 " ++ (show62 as)

--Input/Output
noFileFound :: String -> IO ()
noFileFound str = putStrLn $ "Dateiname existiert nicht: " ++ str


main :: IO ()
main = do
    args <- getArgs
    case args of
        [] -> noFileFound ""
        (fileName:_) -> do
            exists <- doesFileExist fileName
            if exists
                then do
                    content <- readFile fileName
                    doStuff content
                else noFileFound fileName


doStuff :: String -> IO ()
doStuff content = do
    putStrLn (solution6 content)
    putStrLn ""
    putStrLn (solution62 content)
