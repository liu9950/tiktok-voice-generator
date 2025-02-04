document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('voice-form');
    const generateBtn = document.getElementById('generate-btn');
    const textInput = document.getElementById('text-input');
    const charCount = document.querySelector('.char-count');

    // 更新字符计数
    textInput.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = `${count}/300`;
    });

    // 处理表单提交
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const text = textInput.value.trim();
        if (text === "") {
            alert("请输入文字");
            return;
        }

        // 禁用按钮，显示加载状态
        generateBtn.disabled = true;
        generateBtn.textContent = '生成中...';

        try {
            const response = await fetch('https://api-inference.huggingface.co/models/hexgrad/Kokoro-TTS', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer YOUR_HUGGING_FACE_API_KEY',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: text,
                    parameters: {
                        language: document.getElementById('language').value,
                        voice: document.getElementById('voice').value,
                        speed: parseFloat(document.getElementById('speed').value)
                    }
                })
            });

            if (!response.ok) {
                throw new Error('API 请求失败');
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // 创建或更新音频播放器
            let audioResult = document.querySelector('.audio-result');
            if (!audioResult) {
                audioResult = document.createElement('div');
                audioResult.className = 'audio-result';
                form.insertAdjacentElement('afterend', audioResult);
            }
            
            audioResult.innerHTML = `
                <div id="audio-player">
                    <audio controls src="${audioUrl}"></audio>
                    <a href="${audioUrl}" download="tiktok-voice.mp3" class="download-btn">下载音频</a>
                </div>
            `;
        } catch (error) {
            console.error("Error:", error);
            alert("生成语音失败，请重试");
        } finally {
            // 恢复按钮状态
            generateBtn.disabled = false;
            generateBtn.textContent = '生成语音';
        }
    });

    // 处理语速滑块
    const speedInput = document.getElementById('speed');
    const speedValue = document.querySelector('.speed-value');
    
    speedInput.addEventListener('input', function() {
        speedValue.textContent = `${this.value}x`;
    });

    // 添加到现有的 script.js 文件中
    document.getElementById('language-selector').addEventListener('change', function() {
        const selectedLanguage = this.value;
        const urls = {
            'en-US': '/en-us.html',
            'en-UK': '/en-uk.html',
            'zh': '/zh.html',
            'vi': '/vi.html',
            'id': '/id.html',
            'ru': '/ru.html',
            'pt-BR': '/pt-br.html',
            'fr': '/fr.html',
            'ja': '/ja.html',
            'es-MX': '/es-mx.html'
        };
        
        if (urls[selectedLanguage]) {
            window.location.href = urls[selectedLanguage];
        }
    });
}); 