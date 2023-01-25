class RemoveDuplicates {
    public static int remove1(int[] arr) {
        if (arr == null) {
            return 0;
        }
        if (arr.length < 2) {
            return arr.length;
        }

        int size = 1;
        int currentValue = arr[0];

        for (int i = 1; i < arr.length; i++) {
            if (arr[i] != currentValue) {
                currentValue = arr[i];
                size++;
            }
        }

        return size;
    }

    public static int remove(int[] arr) {
        if (arr == null) {
            return 0;
        }

        int nextNonDuplicate = 1;  // index of the next non-duplicate element
        
        for (int i = 0; i < arr.length; i++) {
            if (arr[nextNonDuplicate - 1] != arr[i]) {
                arr[nextNonDuplicate] = arr[i];
                nextNonDuplicate++;
            }
        }

        return nextNonDuplicate;
    }

    public static void main(String[] args) {
        int[] arr = new int[] { 2, 3, 3, 3, 6, 9, 9 };
        System.out.println(RemoveDuplicates.remove(arr));
    
        arr = new int[] { 2, 2, 2, 11 };
        System.out.println(RemoveDuplicates.remove(arr));

        arr = null;
        System.out.println(RemoveDuplicates.remove(arr));

        arr = new int[] { 1 };
        System.out.println(RemoveDuplicates.remove(arr));

        arr = new int[] { 1, 1 };
        System.out.println(RemoveDuplicates.remove(arr));
    }
}
