// class MaximumSumSubarrayOfSizeK {
//     public static int findMaxSumSubArray(int k, int[] arr) {
//         int maxSum = 0, windowSum;

//         for (int i = 0; i <= arr.length - k; i++) {
//             windowSum = 0;
//             for (int j = i; j < i + k; j++) {
//                 windowSum += arr[j];
//             }
//             maxSum = Math.max(maxSum, windowSum);
//         }

//         return maxSum;
//     }

    
//     public static void main(String[] args) {
//         System.out.println("Maximum sum of a subarray of size K: "
//             + MaximumSumSubarrayOfSizeK.findMaxSumSubArray(3, new int[] { 2, 1, 5, 1, 3, 2 }));

//         System.out.println("Maximum sum of a subarray of size K: "
//             + MaximumSumSubarrayOfSizeK.findMaxSumSubArray(2, new int[] { 2, 3, 4, 1, 5 }));
//     }
// }

class MaximumSumSubarrayOfSizeK {
    public static int findMaxSumSubArray(int k, int[] arr) {
        int maxSum = 0, windowStart = 0, windowSum = 0;

        // 这种算法不是很好：
        // 如果到K了，先减掉前面的，然后补上后面新的。Math.max()会在没满k的时候也会触发，但不会影响结果。
        // 还有一种更好的逻辑
        // for (int windowEnd = 0; windowEnd < arr.length; windowEnd++) {
        //     if (windowEnd >= k) {
        //         windowSum -= arr[windowStart];
        //         windowStart++;
        //     }
        //     windowSum += arr[windowEnd];
        //     maxSum = Math.max(maxSum, windowSum);
        // }

        // 在这种逻辑下，只在end到k的情况下，才会去比较math.max(),
        // 先把end加上，如果到k了，则比较math.max(),为下一次的window做好准备(减去start那个值)，轮到下一次时，直接加end的值就好了
        for (int windowEnd = 0; windowEnd < arr.length; windowEnd++) {
            windowSum += arr[windowEnd];
            if (windowEnd >= k - 1) {
                maxSum = Math.max(maxSum, windowSum);
                windowSum -= arr[windowStart];
                windowStart++;
            }
        }

        return maxSum;
    }

    
    public static void main(String[] args) {
        System.out.println("Maximum sum of a subarray of size K: "
            + MaximumSumSubarrayOfSizeK.findMaxSumSubArray(3, new int[] { 2, 1, 5, 1, 3, 2 }));

        System.out.println("Maximum sum of a subarray of size K: "
            + MaximumSumSubarrayOfSizeK.findMaxSumSubArray(2, new int[] { 2, 3, 4, 1, 5 }));
    }
}
