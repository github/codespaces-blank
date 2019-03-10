### Description ###
Given an array of integers, sort the elements in the array in ascending order. The insertion sort algorithm should be used to solve this problem.

Examples
```
{1, 2, 3} is sorted to {1, 2, 3}
{4, 2, -3, 6, 1} is sorted to {-3, 1, 2, 4, 6}
```
Corner Cases

What if the given array is null? In this case, we do not need to do anything.  
What if the given array is of length zero? In this case, we do not need to do anything.

---
### Solution ###
Insertion Sort  
Traverse the array start from position 1. check prev for each element in the array.
if prev > current, swap, till prev reach 0

```java
public class Solution {
  public int[] sort(int[] array) {
    if (array == null || array.length == 0) {
      return array;
    }
    
    // start from 1, check with prev element, if prev > current, swap
    // check till prev reach 0
    for (int i = 1; i < array.length; i++) {
      int prev = i - 1;
      int current = array[i];
      while (prev >= 0 && array[prev] > current) {
        array[prev + 1] = array[prev]; 
        array[prev] = current;
        prev--;
      }
    }
    
    return array;
  }
}

```