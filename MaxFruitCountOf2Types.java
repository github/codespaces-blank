import java.util.HashMap;
import java.util.Map;

class MaxFruitCountOf2Types {
    public static int findLength(char[] arr) {
        if (arr == null || arr.length == 0) {
            return 0;
        }

        int windowStart = 0, maxLength = 0;
        Map<Character, Integer> map = new HashMap<>();
        for (int windowEnd = 0; windowEnd < arr.length; windowEnd++) {
            map.put(arr[windowEnd], map.getOrDefault(arr[windowEnd], 0) + 1);
            while (map.size() > 2) {
                map.put(arr[windowStart], map.get(arr[windowStart]) - 1);
                if (map.get(arr[windowStart]) == 0) {
                    map.remove(arr[windowStart]);
                }
                windowStart++;
            }
            maxLength = Math.max(maxLength, windowEnd - windowStart + 1);
        }

        return maxLength;
    }
    
    public static void main(String[] args) {
        System.out.println("Maximum number of fruits: " +
                MaxFruitCountOf2Types.findLength(new char[] { 'A', 'B', 'C', 'A', 'C' }));
        System.out.println("Maximum number of fruits: " +
                MaxFruitCountOf2Types.findLength(new char[] { 'A', 'B', 'C', 'B', 'B', 'C' }));
    }
}
