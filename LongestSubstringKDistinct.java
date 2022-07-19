import java.util.HashMap;
import java.util.Map;

class LongestSubstringKDistinct {

    public static int findLength(String str, int k) {
        if (str == null || str.length() == 0 || str.length() < k) {
            return 0;
        }
        
        int windowStart = 0, maxLength = 0;
        Map<Character, Integer> map = new HashMap<>();
        // in the following loop we will try to extend the range [windowStart, windowEnd]
        for (int windowEnd = 0; windowEnd < str.length(); windowEnd++) {
            char rightChar = str.charAt(windowEnd);
            map.put(rightChar, map.getOrDefault(rightChar, 0) + 1);
            // shrink the sliding window, untill we are left with 'k' distinct characters in the frequency map
            while (map.size() > k) {
                char leftChar = str.charAt(windowStart);
                map.put(leftChar, map.get(leftChar) - 1);
                if (map.get(leftChar) == 0) {
                    map.remove(leftChar);
                }
                windowStart++; // shrink the window
            }
            // remember the maximum length so far
            maxLength = Math.max(maxLength, windowEnd - windowStart + 1);
        }
        return maxLength;
    }
    
    public static void main(String[] args) {
        System.out.println("Length of the longest substring: " 
           + LongestSubstringKDistinct.findLength("araaci", 2));
        System.out.println("Length of the longest substring: " 
           + LongestSubstringKDistinct.findLength("araaci", 1));
        System.out.println("Length of the longest substring: " 
           + LongestSubstringKDistinct.findLength("cbbebi", 3));
      }
}
