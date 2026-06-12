function isalnum(str) {
	for (let char in str) {
		if (
			!(str[char] >= 'a' && str[char] <= 'z') &&
			!(str[char] >= 'A' && str[char] >= 'Z') &&
			!(str[char] >= '0' && str[char] <= '9')
		) {
			return false
		}
	}
	return true
}

console.log(isalnum('correctstring'))
