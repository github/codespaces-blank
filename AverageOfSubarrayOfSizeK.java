/**
 * Given an array, find the average of all  subarrays of 'K' contiguous elements in it.
 * Let’s understand this problem with a real input:

Array: [1, 3, 2, 6, -1, 4, 1, 8, 2], K=5
Here, we are asked to find the average of all subarrays of '5' contiguous elements in the given array. Let’s solve this:

For the first 5 numbers (subarray from index 0-4), the average is: (1+3+2+6-1)/5 => 2.2
The average of next 5 numbers (subarray from index 1-5) is: (3+2+6-1+4)/5 => 2.8
For the next 5 numbers (subarray from index 2-6), the average is: (2+6-1+4+1)/5 => 2.4
Here is the final output containing the averages of all  subarrays of size '5':

Output: [2.2, 2.8, 2.4, 3.6, 2.8]
 */

// time complexity: O(N * K), where N is the number of elements in the input array
import java.util.Arrays;

// class AverageOfSubarrayOfSizeK {
//     public static double[] findAverages(int K, int[] array) {
//         double result[] = new double[array.length - K + 1];
//         for (int i = 0; i <= array.length - K; i++) {
//             double sum = 0;
//             for (int j = i; j < i + K; j++) {
//                 sum += array[j];
//             }
//             result[i] = sum / K;
//         }
//         return result;
//     }

//     public static void main(String[] args) {
//         double[] result = AverageOfSubarrayOfSizeK.findAverages(5, 
//         new int[] { 1, 3, 2, 6, -1, 4, 1, 8, 2 });

//         System.out.println("Averages of subarrays of size K: " + Arrays.toString(result));
//     }
// }

class AverageOfSubarrayOfSizeK {
    public static double[] findAverages(int K, int[] array) {
        double result[] = new double[array.length - K + 1];
        double windowSum = 0;
        int windowStart = 0;
        for (int windowEnd = 0; windowEnd < array.length; windowEnd++) {
            windowSum += array[windowEnd]; // add the next element
            // slide the window, we don't need to slide if we've not hit the required window size of K
            if (windowEnd >= K - 1) {
                result[windowStart] = windowSum / K; // calculate the average
                windowSum -= array[windowStart]; // subtract the most left element
                windowStart++; // slide the window to right
            }
        }
        return result;
    }

    public static void main(String[] args) {
        double[] result = AverageOfSubarrayOfSizeK.findAverages(5, 
        new int[] { 1, 3, 2, 6, -1, 4, 1, 8, 2 });

        System.out.println("Averages of subarrays of size K: " + Arrays.toString(result));
    }
}