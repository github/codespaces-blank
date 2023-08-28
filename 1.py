def convertStrToInt(n):
    l = len(n)
    if (l==0):
        return 
    if l == 1:
        return ord(n)-ord('0')
        
    first =  ord(n[0]) - ord('0')
    smallList = convertStrToInt(n[1:])
    return (first * (10 ** (l-1))) + smallList
    
convertStrToInt('004569800')
