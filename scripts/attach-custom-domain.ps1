# PowerShell script to attach signal.awsclubgeu.in once ACM certificate validates
param(
    [string]$Profile = "cloudblueprint"
)

$DIST_ID = "EF7N4TUM6PW6K"
$CERT_ARN = "arn:aws:acm:us-east-1:013131247228:certificate/fd8587fa-8cbb-4a60-a0d8-d2ecafa6e157"

Write-Host "Checking ACM Certificate status for signal.awsclubgeu.in..." -ForegroundColor Cyan
$cert = aws acm describe-certificate --certificate-arn $CERT_ARN --region us-east-1 --profile $Profile | ConvertFrom-Json

if ($cert.Certificate.Status -ne "ISSUED") {
    Write-Host "Certificate status is: $($cert.Certificate.Status). Please ensure DNS CNAME is added." -ForegroundColor Yellow
} else {
    Write-Host "Certificate is ISSUED! Updating CloudFront distribution with signal.awsclubgeu.in alias..." -ForegroundColor Green
    
    $configJson = aws cloudfront get-distribution-config --id $DIST_ID --profile $Profile | ConvertFrom-Json
    $etag = $configJson.ETag
    $distConfig = $configJson.DistributionConfig
    
    # Set alias and ACM cert
    $distConfig.Aliases.Quantity = 1
    $distConfig.Aliases.Items = @("signal.awsclubgeu.in")
    $distConfig.ViewerCertificate = @{
        ACMCertificateArn = $CERT_ARN
        SSLSupportMethod = "sni-only"
        MinimumProtocolVersion = "TLSv1.2_2021"
        CertificateSource = "acm"
    }

    $distConfig | ConvertTo-Json -Depth 10 | Set-Content "cf-updated-config.json"
    aws cloudfront update-distribution --id $DIST_ID --if-match $etag --distribution-config file://cf-updated-config.json --profile $Profile
    Write-Host "CloudFront distribution updated with custom domain signal.awsclubgeu.in!" -ForegroundColor Green
}
