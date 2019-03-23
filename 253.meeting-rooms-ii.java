import java.util.PriorityQueue;

/*
 * @lc app=leetcode id=253 lang=java
 *
 * [253] Meeting Rooms II
 *
 * https://leetcode.com/problems/meeting-rooms-ii/description/
 *
 * algorithms
 * Medium (42.05%)
 * Total Accepted:    134.9K
 * Total Submissions: 317.8K
 * Testcase Example:  '[[0,30],[5,10],[15,20]]'
 *
 * Given an array of meeting time intervals consisting of start and end times
 * [[s1,e1],[s2,e2],...] (si < ei), find the minimum number of conference rooms
 * required.
 * 
 * Example 1:
 * 
 * 
 * Input: [[0, 30],[5, 10],[15, 20]]
 * Output: 2
 * 
 * Example 2:
 * 
 * 
 * Input: [[7,10],[2,4]]
 * Output: 1
 * 
 */
/**
 * Definition for an interval.
 * public class Interval {
 *     int start;
 *     int end;
 *     Interval() { start = 0; end = 0; }
 *     Interval(int s, int e) { start = s; end = e; }
 * }
 */

 /**
  * Time Complexity: O(NlogN)O(NlogN).

There are two major portions that take up time here. One is sorting of the array that takes O(NlogN)O(NlogN) considering that the array consists of NN elements.
Then we have the min-heap. In the worst case, all NN meetings will collide with each other. In any case we have NN add operations on the heap. In the worst case we will have NN extract-min operations as well. Overall complexity being (NlogN)(NlogN) since extract-min operation on a heap takes O(logN)O(logN).
Space Complexity: O(N)O(N) because we construct the min-heap and that can contain NN elements in the worst case as described above in the time complexity section. Hence, the space complexity is O(N)O(N). 
  */
class Solution {
    public int minMeetingRooms(Interval[] intervals) {
        if (intervals == null || intervals.length == 0) {
            return 0;
        }

        // MinHeap
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        
        // Sort the intervals by start time
        Arrays.sort(intervals, new Comparator<Interval>(){
            @Override
            public int compare(Interval e1, Interval e2) {
                if (e1.start == e2.start) {
                    return 0;
                }
                return e1.start - e2.start > 0 ? 1 : -1;
            }
        });

        // Add the first meeting
        minHeap.add(intervals[0].end);

        // Iterate over remaining intervals
        for (int i = 1; i < intervals.length; i++) {
            // if the room due to freee up the earliest is free, assign that room to this meeing.
            if (intervals[i].start >= minHeap.peek()) {
                minHeap.poll();
            }
            // if a new room is to be assigned, then also we add to the heap
            // if an old room is allocated, then also we have to add to the heap with updated end time
            minHeap.add(intervals[i].end);
        }

        // the size of the heap tells us the minimum rooms required for all the meetings.
        return minHeap.size();
    }
}

