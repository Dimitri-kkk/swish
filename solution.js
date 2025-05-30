function findLongestPrioritySequence(message) {
  // Handle edge cases
  if (!message || typeof message !== 'string') {
    return '';
  }
  
  // Split the input message into words
  const words = message.split(' ');
  if (words.length <= 1) {
    return '';  // Return empty string for single word (no sequence)
  }
  
  let longestSequence = [];
  let currentSequence = [words[0]];
  
  // Iterate through the words starting from the second word
  for (let i = 1; i < words.length; i++) {
    const currentWord = words[i];
    const previousWord = words[i - 1];
    
    // Get the last character of the previous word and the first character of the current word
    const lastChar = previousWord.charAt(previousWord.length - 1).toLowerCase();
    const firstChar = currentWord.charAt(0).toLowerCase();
    
    // Check if the current word starts with the last character of the previous word
    if (firstChar === lastChar) {
      // Continue the current sequence
      currentSequence.push(currentWord);
    } else {
      // Start a new sequence if the current one is broken
      if (currentSequence.length > longestSequence.length) {
        longestSequence = [...currentSequence];
      }
      currentSequence = [currentWord];
    }
  }
  
  // Check one more time after the loop ends
  if (currentSequence.length > longestSequence.length) {
    longestSequence = [...currentSequence];
  }
  
  // Return the longest sequence joined with spaces
  return longestSequence.length > 1 ? longestSequence.join(' ') : '';
}

// Test cases
console.log('Example 1:');
console.log('Input: "apple elegant task king green"');
console.log('Output: "' + findLongestPrioritySequence('apple elegant task king green') + '"');

console.log('\nExample 2:');
console.log('Input: "hello Open next Time easy"');
console.log('Output: "' + findLongestPrioritySequence('hello Open next Time easy') + '"');

// Additional test cases
console.log('\nAdditional test cases:');
console.log('Empty string: "' + findLongestPrioritySequence('') + '"');
console.log('Single word: "' + findLongestPrioritySequence('hello') + '"');
console.log('No valid sequence: "' + findLongestPrioritySequence('cat dog bird') + '"');
console.log('Case insensitivity: "' + findLongestPrioritySequence('Dog Great Tea Apple') + '"'); 