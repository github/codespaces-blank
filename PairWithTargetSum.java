import java.util.HashMap;

class PairWithTargetSum {
    public static int[] search(int[] arr, int targetSum) {
        int left = 0, right = arr.length - 1;

        while (left < right) {
            int addUp = arr[left] + arr[right];
            if (addUp == targetSum) {
                return new int[] {left, right}; // find the pair
            }
            if (addUp > targetSum) {
                right--;  // we need to pair with a smaller sum
            } else {
                left++;  // we need to pair with a bigger sum
            }
        }

        return new int[] {-1, -1};
    }

    public static int[] searchWithHashMap(int[] arr, int targetSum) {
        HashMap<Integer, Integer> map = new HashMap<>();  // to store numbers and index

        for(int i = 0; i < arr.length; i++) {
            if (map.containsKey(targetSum - arr[i])) {
                return new int[] {map.get(targetSum - arr[i]), i};
            }
            map.put(arr[i], i);  // put the number and its index in the map
        }

        return new int[] {-1, -1};  // pair not found
    }

    public static void main(String[] args) {
        int[] result = PairWithTargetSum.search(new int[] {1, 2, 3, 4, 6}, 6);
        System.out.println("Pair with target sum: [" + result[0] + ", " + result[1] + "]");
        result = PairWithTargetSum.search(new int[] {2, 5, 9, 11}, 11);
        System.out.println("Pair with target sum: [" + result[0] + ", " + result[1] + "]");
    }
}
