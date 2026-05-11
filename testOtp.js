async function sendOTP() {
  try {
    console.log('Sending OTP via MSG91...');
    
    const response = await fetch('https://control.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: {
        authkey: '515357AalZZhTK6a000c69P1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile: '917339509611',
        template_id: '69ffa75a6ad512585a0ea1a2',
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }
    console.log('\n✅ SUCCESS:', data);

  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
  }
}

sendOTP();
