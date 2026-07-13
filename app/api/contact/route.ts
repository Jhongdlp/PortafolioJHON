import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    // Validaciones básicas
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.log('✉️ [CONTACT FORM - MOCK SUBMISSION]')
      console.log(`Nombre: ${name}`)
      console.log(`Email:  ${email}`)
      console.log(`Mensaje:\n${message}`)
      console.log('👉 Configura RESEND_API_KEY en tu archivo .env.local para enviar emails reales.')
      
      // Retornamos éxito en desarrollo para probar la animación y modal de la interfaz
      return NextResponse.json({
        success: true,
        mock: true,
        message: 'Mock submission successful. Configure RESEND_API_KEY to send real emails.',
      })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: 'jhongdlp204@gmail.com',
        subject: `Nuevo mensaje de ${name} (Portafolio)`,
        html: `
          <div style="font-family: system-ui, sans-serif; padding: 30px; color: #16130F; background-color: #F2EFE6; border-radius: 8px; border: 1px solid #16130F;">
            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px; border-bottom: 1px solid rgba(22, 19, 15, 0.1); padding-bottom: 10px;">Nuevo mensaje del portafolio</h2>
            <p style="margin: 8px 0;"><strong>Nombre:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 20px 0 8px 0;"><strong>Mensaje:</strong></p>
            <div style="white-space: pre-wrap; background: rgba(255,255,255,0.5); padding: 15px; border-radius: 6px; border: 1px solid rgba(22, 19, 15, 0.1); line-height: 1.5;">${message}</div>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const errorData = await res.json()
      console.error('Error from Resend API:', errorData)
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
