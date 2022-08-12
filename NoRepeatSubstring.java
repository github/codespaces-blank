import java.util.HashMap;
import java.util.Map;

class NoRepeatSubstring {
    public static int findLength(String str) {
        if (str == null || str.length() == 0) {
            return 0;
        }
        int windowStart = 0, maxLength = 0;
        Map<Character, Integer> map = new HashMap<>();
        // try to extend the range [windowStart, windowEnd]
        for (int windowEnd = 0; windowEnd < str.length(); windowEnd++) {
            char rightChar = str.charAt(windowEnd);
            // if the map already contains the 'rightChar', shrink the window from the
            // beginning so that we have only one occurrence of 'rightChar'
            if (map.containsKey(rightChar)) {
                // this is tricky; in the current window, we will not have any 'rightChar' after
                // its previous index and if 'windowStart' is already ahead of the last index of
                // 'rightChar', we will keep 'windowStart'
                windowStart = Math.max(windowStart, map.get(rightChar) + 1);

            }
            map.put(rightChar, windowEnd); // insert the 'rightChar' into the map
            // remember the maximum length so far
            maxLength = Math.max(maxLength, windowEnd - windowStart + 1);
        }
        return maxLength;
    }

    public static void main(String[] args) {
        System.out.println("Length of the longest substring: "
                    + NoRepeatSubstring.findLength("aabccbb"));
        System.out.println("Length of the longest substring: "
                    + NoRepeatSubstring.findLength("abbbb"));
        System.out.println("Length of the longest substring: "
                    + NoRepeatSubstring.findLength("abccde"));
    }
}

